/**
 * Drag-and-Drop File Upload Component
 * Triggers the PDF parsing pipeline to extract legal metadata from documents
 */
import { PDF_PRESETS } from '../pdfProcessor.js';

export function renderFileUploadZone() {
  const files = window.MOCK?.documents || [];

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">رفع ومعالجة ملفات القضايا (PDF)</h1>
        <div class="page-subtitle">محرك الذكاء الاصطناعي لاستخراج أرقام القضايا، تواريخ الجلسات، والمحاكم تلقائياً وتخزينها في Supabase</div>
      </div>
    </div>

    <!-- Drag & Drop Zone Container with HTML5 Event Handlers -->
    <div 
      class="upload-zone" 
      id="drag-drop-upload-zone"
      data-action="trigger-upload"
      ondragenter="window.handleDragEnter(event)"
      ondragover="window.handleDragOver(event)"
      ondragleave="window.handleDragLeave(event)"
      ondrop="window.handleFileDrop(event)"
    >
      <input type="file" id="file-upload-input" style="display:none;" accept=".pdf,application/pdf" onchange="window.handleFileSelect(event)">
      
      <div class="upload-icon-wrapper" style="pointer-events:none;">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>

      <div class="upload-title" style="pointer-events:none;">
        اسحب وأفلت ملف PDF القضائي هنا أو انقر للاختيار من جهازك
      </div>
      
      <div class="upload-desc" style="pointer-events:none;">
        يقوم محرك OCR والنماذج اللغوية بتحليل الصحيفة أو الحكم، استخراج رقم الدعوى، تواريخ الجلسات، أطراف النزاع، والطلبات تلقائياً مع توليد إحداثيات Bounding Boxes للتحقق السريع.
      </div>

      <button class="btn btn-outline" type="button" style="margin-block-start:8px; pointer-events:auto;" onclick="document.getElementById('file-upload-input').click()">
        📁 استعراض واختيار ملف PDF من الجهاز
      </button>

      <div class="drop-overlay-msg" id="drop-overlay-msg" style="display:none; font-weight:700; color:var(--accent); margin-block-start:10px;">
        ⚡ أفلت الملف الآن لبدء المعالجة واستخراج البيانات تلقائياً...
      </div>
    </div>

    <!-- Quick PDF Presets For Instant Verification & Demonstrations -->
    <div style="margin-block-start:24px;">
      <div style="font-size:13px; font-weight:700; color:var(--text); margin-block-end:10px; display:flex; align-items:center; justify-content:space-between;">
        <span style="display:flex; align-items:center; gap:6px;">
          <span>📄 نماذج ملفات PDF قضائية حقيقية للتجربة والاستخراج الفوري:</span>
        </span>
        <span style="font-size:11px; color:var(--text-dim);">انقر لمعالجة نموذج واستخراج بياناته</span>
      </div>

      <div class="upload-presets-grid">
        ${PDF_PRESETS.map(p => `
          <div class="upload-preset-card" data-action="process-preset-pdf" data-preset-id="${p.id}" style="cursor:pointer;" title="معالجة فورية للملف">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <div style="flex:1; overflow:hidden;">
              <div style="font-size:13px; font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; color:var(--text);">${p.filename}</div>
              <div style="font-size:11px; color:var(--text-dim); margin-block-start:2px;">
                <bdi>${p.page_count}</bdi> صفحات • ${p.extractions?.length || 6} حقول مستخرجة
              </div>
            </div>
            <button class="btn btn-outline btn-sm" style="font-size:11px; padding:4px 10px;">
              ⚡ معالجة واستخراج
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Files in Processing Pipeline -->
    <div class="progress-list" style="margin-block-start:28px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-block-end:14px;">
        <h3 class="doc-heading" style="font-size:18px; margin:0;">سجل معالجة المستندات في قاعدة البيانات</h3>
        <span class="chip chip-confirmed"><bdi>${files.length}</bdi> مستندات مسجلة</span>
      </div>

      ${files.map(f => {
        const stageIndex = f.ocr_status === 'queued' ? 1 : (f.ocr_status === 'reading' ? 2 : (f.ocr_status === 'extracting' ? 3 : 4));
        return `
          <div class="file-progress-card">
            <div class="file-info-row">
              <div class="filename" style="display:flex; align-items:center; gap:8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                <span><strong>${f.filename}</strong> (<bdi>${f.page_count}</bdi> صفحات)</span>
              </div>
              <div>
                ${f.ocr_status === 'review' ? `
                  <button class="btn btn-primary btn-sm" data-action="open-review-doc" data-doc-id="${f.id}">
                    🔍 بدء المراجعة والاعتماد
                  </button>
                ` : `
                  <span class="chip ${f.ocr_status === 'done' ? 'chip-confirmed' : 'chip-stage'}">${f.uploaded_at}</span>
                `}
              </div>
            </div>

            <!-- Pipeline Stepper -->
            <div class="file-stepper">
              <div class="file-step ${stageIndex >= 1 ? (stageIndex > 1 ? 'completed' : 'current') : ''}">
                <div class="step-dot">${stageIndex > 1 ? '✓' : '١'}</div>
                <div class="step-name">في الانتظار</div>
              </div>
              <div class="file-step ${stageIndex >= 2 ? (stageIndex > 2 ? 'completed' : 'current') : ''}">
                <div class="step-dot">${stageIndex > 2 ? '✓' : '٢'}</div>
                <div class="step-name">جاري القراءة (OCR)</div>
              </div>
              <div class="file-step ${stageIndex >= 3 ? (stageIndex > 3 ? 'completed' : 'current') : ''}">
                <div class="step-dot">${stageIndex > 3 ? '✓' : '٣'}</div>
                <div class="step-name">استخراج بالذكاء الاصطناعي</div>
              </div>
              <div class="file-step ${stageIndex >= 4 ? (f.ocr_status === 'done' ? 'completed' : 'current') : ''}">
                <div class="step-dot">${f.ocr_status === 'done' ? '✓' : '٤'}</div>
                <div class="step-name">${f.ocr_status === 'done' ? 'تم الاعتماد' : 'بانتظار المراجعة'}</div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
