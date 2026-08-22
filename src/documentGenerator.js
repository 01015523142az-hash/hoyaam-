/**
 * Document Generation Engine
 * Maps selected template variables to specific case fields from the Supabase database
 * to populate the legal document preview pane.
 */
import { supabaseService } from './services/supabaseService.js';

export function renderDocumentGeneratorScreen(state) {
  const templates = window.MOCK?.templates || [];
  const selectedTemplateId = state.generatorTemplateId || templates[0]?.id || 'tmpl_1';
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  
  const matters = window.MOCK?.matters || [];
  const activeMatter = matters.find(m => m.id === state.activeMatterId) || matters[0];

  // Map selected template variables to specific case fields from Supabase
  const mappingResult = supabaseService.mapTemplateVariables(
    selectedTemplate, 
    activeMatter, 
    state.generatorCustomVars || {}
  );
  const currentVars = mappingResult.variables;
  const renderedContent = mappingResult.renderedText;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">محرك توليد وصياغة الوثائق القانونية الذكية</h1>
        <div class="page-subtitle">دمج المتغيرات والوقائع تلقائياً من قاعدة بيانات Supabase إلى القوالب المعتمدة</div>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" data-action="ai-enhance-document" title="إعادة الصياغة وتدقيق الأسانيد بالذكاء الاصطناعي">
          <span class="ai-summary-badge" style="cursor:pointer;">✨ تدقيق وصياغة بالذكاء الاصطناعي</span>
        </button>
        <button class="btn btn-outline btn-sm" data-action="copy-generated-doc">
          📋 نسخ النص
        </button>
        <button class="btn btn-primary btn-sm" data-action="save-doc-to-matter">
          💾 حفظ بملف القضية في Supabase
        </button>
      </div>
    </div>

    <div class="generator-layout">
      <!-- Controls & Parameters Pane -->
      <div class="generator-controls-pane">
        <div class="form-group">
          <label class="form-label">القضية المستهدفة (مصدر بيانات Supabase)</label>
          <select class="form-select" id="gen-matter-select" onchange="window.handleGeneratorMatterChange(this.value)">
            ${matters.map(m => `
              <option value="${m.id}" ${m.id === activeMatter?.id ? 'selected' : ''}>
                ${m.case_number} — ${m.client_name} (${m.court})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">قالب الوثيقة القانونية المعتمد من Supabase</label>
          <select class="form-select" id="gen-template-select" onchange="window.handleGeneratorTemplateChange(this.value)">
            ${templates.map(t => `
              <option value="${t.id}" ${t.id === selectedTemplateId ? 'selected' : ''}>
                ${t.name} (${t.category})
              </option>
            `).join('')}
          </select>
        </div>

        <div style="font-size:12px; color:var(--text-dim); padding:10px 14px; background:var(--inset); border-radius:var(--radius-sm); border:1px solid var(--border);">
          <strong>وصف القالب:</strong> ${selectedTemplate?.description || 'قالب قانوني معتمد'}
          <div style="margin-block-start:4px; font-size:11px; color:var(--text-2);">
            المحكمة المختصة: <strong>${selectedTemplate?.court_level || 'محرر قضائي'}</strong>
          </div>
        </div>

        <!-- Editable Variable Fields Mapped to Supabase Entity -->
        <div style="border-block-start:1px solid var(--border); padding-block-start:14px; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:13px; color:var(--text);">المتغيرات المدمجة من ملف القضية:</strong>
            <span class="chip chip-confirmed" style="font-size:10px;">ربط مباشر Supabase</span>
          </div>

          <div class="form-group">
            <label class="form-label">اسم المدعي / الموكل (client_name)</label>
            <input type="text" class="form-input" data-gen-var="client_name" value="${currentVars.client_name}">
          </div>

          <div class="form-group">
            <label class="form-label">اسم المدعى عليه / الخصم (opponent_name)</label>
            <input type="text" class="form-input" data-gen-var="opponent_name" value="${currentVars.opponent_name}">
          </div>

          <div class="form-group">
            <label class="form-label">موطن إعلان الخصم (opponent_address)</label>
            <input type="text" class="form-input" data-gen-var="opponent_address" value="${currentVars.opponent_address}">
          </div>

          <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:10px;">
            <div class="form-group">
              <label class="form-label">رقم الدعوى (case_number)</label>
              <input type="text" class="form-input" data-gen-var="case_number" value="${currentVars.case_number}">
            </div>
            <div class="form-group">
              <label class="form-label">السنة (case_year)</label>
              <input type="text" class="form-input" data-gen-var="case_year" value="${currentVars.case_year}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">المحكمة والدائرة (court & circuit)</label>
            <input type="text" class="form-input" data-gen-var="court" value="${currentVars.court}">
          </div>

          <div class="form-group">
            <label class="form-label">مقر المحكمة (court_address)</label>
            <input type="text" class="form-input" data-gen-var="court_address" value="${currentVars.court_address}">
          </div>

          <div class="form-group">
            <label class="form-label">تاريخ الجلسة المقررة (next_hearing_date)</label>
            <input type="text" class="form-input" data-gen-var="next_hearing_date" value="${currentVars.next_hearing_date}">
          </div>

          <div class="form-group">
            <label class="form-label">قيمة المطالبة المالية (claim_amount)</label>
            <input type="text" class="form-input" data-gen-var="claim_amount" value="${currentVars.claim_amount}">
          </div>

          <div class="form-group">
            <label class="form-label">موضوع الدعوى والطلبات (subject)</label>
            <textarea class="form-textarea" rows="3" data-gen-var="subject">${currentVars.subject}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">المحامي المسؤول والموقع (assigned_to)</label>
            <input type="text" class="form-input" data-gen-var="assigned_to" value="${currentVars.assigned_to}">
          </div>
        </div>
      </div>

      <!-- Live Court Parchment Preview Pane -->
      <div class="generator-preview-pane">
        <div class="generator-preview-toolbar">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="chip chip-confirmed">معاينة حية للمستند الرسمي</span>
            <span style="font-size:12px; color:var(--text-dim);">${selectedTemplate?.court_level || 'محرر قضائي'}</span>
          </div>

          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-sm" onclick="window.printLegalDocument()">
              🖨️ طباعة رسمية
            </button>
            <button class="btn btn-primary btn-sm" data-action="copy-generated-doc">
              📋 نسخ النص
            </button>
          </div>
        </div>

        <div class="generator-preview-canvas" id="printable-legal-doc">
          <div class="legal-parchment">
            <div class="legal-header-emblem">
              <div class="legal-basmalah">بسم الله الرحمن الرحيم</div>
              <div style="font-size:15px; font-weight:700; color:var(--text);">جمهورية مصر العربية — وزارة العدل</div>
              <div class="legal-sub-header">مكتب الأستاذ / ${currentVars.assigned_to} — محامٍ لدى محكمة النقض والدستورية العليا</div>
            </div>

            <div class="legal-body-text" id="legal-rendered-text">${escapeHtml(renderedContent)}</div>

            <div style="margin-block-start:40px; display:flex; justify-content:space-between; align-items:flex-end; border-block-start:1px solid #D1D5DB; padding-block-start:16px; font-size:14px;">
              <div>
                <strong>تاريخ التحرير:</strong> <bdi>${currentVars.date}</bdi><br>
                <strong>تحريراً بمعرفة:</strong> ${currentVars.assigned_to}
              </div>
              <div style="text-align:center;">
                <strong>توقيع وكيل الدفاع / المستأنف</strong><br><br>
                <span style="font-family:var(--font-doc); font-size:18px; color:var(--text-2);">أحمد عبد الرحمن المحامي</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
