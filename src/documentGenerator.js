/**
 * Legal Document Generation Engine with Supabase Template Interpolation & AI Enhancements
 */

export function renderDocumentGeneratorScreen(state) {
  const templates = window.MOCK?.templates || [];
  const selectedTemplateId = state.generatorTemplateId || templates[0]?.id || 'tmpl_1';
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  
  const matters = window.MOCK?.matters || [];
  const activeMatter = matters.find(m => m.id === state.activeMatterId) || matters[0];

  // Derive variable values from active matter
  const defaultVars = {
    client_name: activeMatter.client_name || '',
    opponent_name: activeMatter.opponent_name || '',
    opponent_address: '٢٤ شارع مصدق - الدقي - الجيزة',
    case_number: activeMatter.case_number || '',
    case_year: activeMatter.case_year || '2025',
    court: activeMatter.court || '',
    circuit: activeMatter.circuit || '',
    court_address: 'مجمع محاكم العباسية - ميدان العباسية - القاهرة',
    subject: activeMatter.subject || '',
    next_hearing_date: activeMatter.next_hearing_date || '2026-08-25',
    assigned_to: activeMatter.assigned_to || 'أ/ أحمد عبد الرحمن',
    date: '2026-08-22',
    day_name: 'السبت',
    trigger_date: '2026-07-14',
    claim_amount: '١٨,٥٠٠,٠٠٠ جنيه مصري'
  };

  // Merge with custom state variables if edited
  const currentVars = { ...defaultVars, ...(state.generatorCustomVars || {}) };

  // Interpolate template content
  let renderedContent = selectedTemplate?.template_content || '';
  Object.keys(currentVars).forEach(key => {
    const token = new RegExp(`{{${key}}}`, 'g');
    renderedContent = renderedContent.replace(token, currentVars[key]);
  });

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">توليد وصياغة الوثائق القانونية الذكية</h1>
        <div class="page-subtitle">دمج المتغيرات والوقائع تلقائياً من ملف القضية إلى القوالب المعتمدة</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline btn-sm" data-action="ai-enhance-document" title="إعادة الصياغة وتدقيق الأسانيد بالذكاء الاصطناعي">
          <span class="ai-summary-badge" style="cursor:pointer;">✨ تدقيق وصياغة بالذكاء الاصطناعي</span>
        </button>
        <button class="btn btn-outline btn-sm" data-action="copy-generated-doc">
          📋 نسخ النص
        </button>
        <button class="btn btn-primary btn-sm" data-action="save-doc-to-matter">
          💾 حفظ بملف القضية
        </button>
      </div>
    </div>

    <div class="generator-layout">
      <!-- Controls & Parameters Pane -->
      <div class="generator-controls-pane">
        <div class="form-group">
          <label class="form-label">القضية المستهدفة (المتغيرات الأساسية)</label>
          <select class="form-select" id="gen-matter-select" onchange="window.handleGeneratorMatterChange(this.value)">
            ${matters.map(m => `
              <option value="${m.id}" ${m.id === activeMatter.id ? 'selected' : ''}>
                ${m.case_number} — ${m.client_name}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">قالب الوثيقة القانونية المعتمد</label>
          <select class="form-select" id="gen-template-select" onchange="window.handleGeneratorTemplateChange(this.value)">
            ${templates.map(t => `
              <option value="${t.id}" ${t.id === selectedTemplateId ? 'selected' : ''}>
                ${t.name} (${t.category})
              </option>
            `).join('')}
          </select>
        </div>

        <div style="font-size:12px; color:var(--text-dim); padding:8px 12px; background:var(--inset); border-radius:var(--radius-sm);">
          <strong>وصف القالب:</strong> ${selectedTemplate?.description || ''}
        </div>

        <!-- Editable Variable Fields -->
        <div style="border-block-start:1px solid var(--border); padding-block-start:12px; display:flex; flex-direction:column; gap:12px;">
          <strong style="font-size:13px; color:var(--text);">بيانات التوليد المدمجة تلقائياً:</strong>

          <div class="form-group">
            <label class="form-label">اسم المدعي / الموكل</label>
            <input type="text" class="form-input" data-gen-var="client_name" value="${currentVars.client_name}">
          </div>

          <div class="form-group">
            <label class="form-label">اسم المدعى عليه / الخصم</label>
            <input type="text" class="form-input" data-gen-var="opponent_name" value="${currentVars.opponent_name}">
          </div>

          <div class="form-group">
            <label class="form-label">رقم الدعوى والسنة</label>
            <input type="text" class="form-input" data-gen-var="case_number" value="${currentVars.case_number}">
          </div>

          <div class="form-group">
            <label class="form-label">المحكمة المختصة والدائرة</label>
            <input type="text" class="form-input" data-gen-var="court" value="${currentVars.court}">
          </div>

          <div class="form-group">
            <label class="form-label">تاريخ الجلسة القادمة</label>
            <input type="text" class="form-input" data-gen-var="next_hearing_date" value="${currentVars.next_hearing_date}">
          </div>

          <div class="form-group">
            <label class="form-label">موضوع الطلبات</label>
            <textarea class="form-textarea" rows="3" data-gen-var="subject">${currentVars.subject}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">المحامي المسؤول والموقع</label>
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
              📋 نسخ للمحرر
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
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
