import { MOCK } from './mockData.js';
import { getUrgentAlerts, renderNotificationDropdown } from './notifications.js';
import { renderDocumentGeneratorScreen } from './documentGenerator.js';
import { renderArchiveSearchScreen } from './aiSearch.js';
import { PDF_PRESETS, processUploadedPdf } from './pdfProcessor.js';

// Expose MOCK globally as single database seam
window.MOCK = MOCK;

// Global Application State
export const state = {
  activeScreen: 'dashboard', // dashboard, matters, matter-detail, roll, deadlines, upload, review, search, rules, generator
  activeMatterId: 'mat_101',
  matterActiveTab: 'overview',
  activeDocumentId: 'doc_401',
  activeExtractionId: 'ext_504',
  theme: 'light',
  matterFilterCourt: 'all',
  matterFilterStage: 'all',
  matterFilterStatus: 'all',
  matterFilterLawyer: 'all',
  matterSearchQuery: '',
  archiveSearchQuery: 'عقد المقاولة',
  archiveFilterCourt: 'all',
  archiveFilterDocType: 'all',
  rollSelectedDate: '2026-08-22',
  rollFilterMineOnly: false,
  showRuleModal: false,
  editingRule: null,
  ruleFormErrors: {},
  showNotifDropdown: false,
  generatorTemplateId: 'tmpl_1',
  generatorCustomVars: {},
  toastMessage: null
};

// Utility Helpers
function formatCaseNumber(num) {
  return `<bdi>${num}</bdi>`;
}

function formatDate(dateStr) {
  return `<bdi>${dateStr}</bdi>`;
}

function getDaysRemaining(dueDateStr) {
  const target = new Date(dueDateStr);
  const today = new Date('2026-08-22');
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function showToast(msg) {
  state.toastMessage = msg;
  renderApp();
  setTimeout(() => {
    state.toastMessage = null;
    renderApp();
  }, 3000);
}

// App Initialization
export function initApp() {
  const savedTheme = localStorage.getItem('app-theme') || 'light';
  state.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', state.theme);

  document.addEventListener('click', handleActionClick);
  document.addEventListener('input', handleActionInput);

  renderApp();
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('app-theme', state.theme);
  renderApp();
}

function handleActionClick(e) {
  const target = e.target.closest('[data-action]');
  
  // Close notification dropdown if clicked outside
  if (!e.target.closest('.notif-wrapper') && state.showNotifDropdown) {
    state.showNotifDropdown = false;
    renderApp();
  }

  if (!target) return;

  const action = target.getAttribute('data-action');
  const matterId = target.getAttribute('data-matter-id');
  const docId = target.getAttribute('data-doc-id');
  const extId = target.getAttribute('data-ext-id');
  const tabName = target.getAttribute('data-tab');
  const dateVal = target.getAttribute('data-date');
  const ruleId = target.getAttribute('data-rule-id');
  const presetId = target.getAttribute('data-preset-id');
  const term = target.getAttribute('data-term');

  switch (action) {
    case 'nav-screen': {
      const screen = target.getAttribute('data-screen');
      if (screen) {
        state.activeScreen = screen;
        state.showNotifDropdown = false;
        renderApp();
      }
      break;
    }

    case 'toggle-theme':
      toggleTheme();
      break;

    case 'toggle-notifs':
      state.showNotifDropdown = !state.showNotifDropdown;
      renderApp();
      break;

    case 'open-matter':
      if (matterId) {
        state.activeMatterId = matterId;
        state.matterActiveTab = 'overview';
        state.activeScreen = 'matter-detail';
        state.showNotifDropdown = false;
        renderApp();
      }
      break;

    case 'switch-matter-tab':
      if (tabName) {
        state.matterActiveTab = tabName;
        renderApp();
      }
      break;

    case 'confirm-deadline': {
      const deadlineId = target.getAttribute('data-deadline-id');
      const dl = window.MOCK.deadlines.find(d => d.id === deadlineId);
      if (dl) {
        dl.status = 'confirmed';
        showToast('تم تأكيد الميعاد القانوني بنجاح وإدراجه بالسجل الرسمي');
      }
      break;
    }

    case 'select-extraction':
      if (extId) {
        state.activeExtractionId = extId;
        renderApp();
      }
      break;

    case 'accept-extraction': {
      const ext = window.MOCK.extractions.find(x => x.id === extId);
      if (ext) {
        ext.review_state = 'accepted';
        renderApp();
      }
      break;
    }

    case 'correct-extraction': {
      const inputEl = document.querySelector(`input[data-ext-input="${extId}"]`);
      const ext = window.MOCK.extractions.find(x => x.id === extId);
      if (ext && inputEl) {
        ext.field_value = inputEl.value;
        ext.review_state = 'corrected';
        renderApp();
      }
      break;
    }

    case 'reject-extraction': {
      const ext = window.MOCK.extractions.find(x => x.id === extId);
      if (ext) {
        ext.review_state = 'rejected';
        renderApp();
      }
      break;
    }

    case 'accept-all-extractions': {
      window.MOCK.extractions.forEach(x => {
        if (x.document_id === state.activeDocumentId && x.review_state === 'pending') {
          x.review_state = 'accepted';
        }
      });
      showToast('تم اعتماد جميع الحقول المستخرجة من المستند بنجاح');
      renderApp();
      break;
    }

    case 'save-review-next': {
      const currentDoc = window.MOCK.documents.find(d => d.id === state.activeDocumentId);
      if (currentDoc) {
        currentDoc.ocr_status = 'done';
      }
      showToast('تم حفظ المستند واعتماده في ملف القضية');
      state.activeScreen = 'upload';
      renderApp();
      break;
    }

    case 'open-review-doc':
      if (docId) {
        state.activeDocumentId = docId;
        const firstExt = window.MOCK.extractions.find(x => x.document_id === docId);
        if (firstExt) state.activeExtractionId = firstExt.id;
        state.activeScreen = 'review';
        renderApp();
      }
      break;

    case 'open-chronology-doc':
      if (docId) {
        state.activeDocumentId = docId;
        state.activeScreen = 'review';
        renderApp();
      }
      break;

    case 'select-roll-date':
      if (dateVal) {
        state.rollSelectedDate = dateVal;
        renderApp();
      }
      break;

    case 'toggle-my-hearings':
      state.rollFilterMineOnly = !state.rollFilterMineOnly;
      renderApp();
      break;

    case 'open-rule-modal':
      state.editingRule = null;
      state.ruleFormErrors = {};
      state.showRuleModal = true;
      renderApp();
      break;

    case 'edit-rule':
      if (ruleId) {
        const r = window.MOCK.deadline_rules.find(rule => rule.id === ruleId);
        state.editingRule = r ? { ...r } : null;
        state.ruleFormErrors = {};
        state.showRuleModal = true;
        renderApp();
      }
      break;

    case 'close-rule-modal':
      state.showRuleModal = false;
      state.editingRule = null;
      renderApp();
      break;

    case 'save-rule':
      handleSaveRule();
      break;

    case 'trigger-upload': {
      const fileInput = document.getElementById('file-upload-input');
      if (fileInput) fileInput.click();
      break;
    }

    case 'process-preset-pdf': {
      if (presetId) {
        const preset = PDF_PRESETS.find(p => p.id === presetId);
        if (preset) {
          processUploadedPdf(preset, state);
          showToast(`تم استخراج رقم القضية (${preset.extractions[0]?.field_value}) والجلسة والمحكمة آلياً بالذكاء الاصطناعي`);
          renderApp();
        }
      }
      break;
    }

    case 'search-archive-trigger':
      renderApp();
      break;

    case 'quick-search':
      if (term) {
        state.archiveSearchQuery = term;
        state.activeScreen = 'search';
        renderApp();
      }
      break;

    case 'ai-enhance-document': {
      showToast('✨ قام الذكاء الاصطناعي بتدقيق الأسانيد وتدعيم الدفوع الموضوعية والشكلية');
      break;
    }

    case 'copy-generated-doc': {
      const textEl = document.getElementById('legal-rendered-text');
      if (textEl) {
        navigator.clipboard?.writeText(textEl.innerText);
        showToast('📋 تم نسخ نص الوثيقة القانونية إلى الحافظة بنجاح');
      }
      break;
    }

    case 'save-doc-to-matter': {
      const activeM = window.MOCK.matters.find(m => m.id === state.activeMatterId) || window.MOCK.matters[0];
      const newDoc = {
        id: 'doc_' + (window.MOCK.documents.length + 401),
        matter_id: activeM.id,
        filename: `مسودة_مولدة_${state.generatorTemplateId}_${activeM.case_number}.pdf`,
        page_count: 3,
        uploaded_at: 'الآن (مولد آلياً)',
        ocr_status: 'done'
      };
      window.MOCK.documents.unshift(newDoc);
      showToast(`تم حفظ المحرر الرسمي بملف القضية (${activeM.case_number})`);
      state.activeScreen = 'matter-detail';
      state.matterActiveTab = 'documents';
      renderApp();
      break;
    }

    case 'open-generator-for-matter': {
      if (matterId) state.activeMatterId = matterId;
      state.activeScreen = 'generator';
      renderApp();
      break;
    }
  }
}

function handleActionInput(e) {
  const target = e.target;
  const action = target.getAttribute('data-action');
  const genVar = target.getAttribute('data-gen-var');

  if (action === 'matter-search') {
    state.matterSearchQuery = target.value;
    renderMatterListTable();
  } else if (action === 'archive-search') {
    state.archiveSearchQuery = target.value;
  } else if (genVar) {
    if (!state.generatorCustomVars) state.generatorCustomVars = {};
    state.generatorCustomVars[genVar] = target.value;
    
    // Update live preview directly without re-rendering entire screen
    const liveTextEl = document.getElementById('legal-rendered-text');
    if (liveTextEl) {
      const templates = window.MOCK?.templates || [];
      const selectedTemplate = templates.find(t => t.id === state.generatorTemplateId) || templates[0];
      const matters = window.MOCK?.matters || [];
      const activeMatter = matters.find(m => m.id === state.activeMatterId) || matters[0];
      const currentVars = {
        client_name: activeMatter.client_name,
        opponent_name: activeMatter.opponent_name,
        opponent_address: '٢٤ شارع مصدق - الدقي - الجيزة',
        case_number: activeMatter.case_number,
        court: activeMatter.court,
        circuit: activeMatter.circuit,
        court_address: 'مجمع محاكم العباسية - ميدان العباسية - القاهرة',
        subject: activeMatter.subject,
        next_hearing_date: activeMatter.next_hearing_date,
        assigned_to: activeMatter.assigned_to,
        date: '2026-08-22',
        day_name: 'السبت',
        trigger_date: '2026-07-14',
        claim_amount: '١٨,٥٠٠,٠٠٠ جنيه مصري',
        ...state.generatorCustomVars
      };
      let text = selectedTemplate.template_content;
      Object.keys(currentVars).forEach(k => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), currentVars[k] || '');
      });
      liveTextEl.innerText = text;
    }
  }
}

function handleSaveRule() {
  const nameEl = document.getElementById('rule-name-input');
  const triggerEl = document.getElementById('rule-trigger-input');
  const durationEl = document.getElementById('rule-duration-input');
  const unitEl = document.getElementById('rule-unit-input');
  const citationEl = document.getElementById('rule-citation-input');

  const errors = {};
  if (!nameEl?.value.trim()) errors.rule_name = 'اسم القاعدة مطلوب';
  if (!triggerEl?.value.trim()) errors.trigger_event = 'الحدث المُشغِّل مطلوب';
  if (!durationEl?.value || parseInt(durationEl.value) <= 0) errors.duration = 'المدة يجب أن تكون رقماً موجباً';
  if (!citationEl?.value.trim()) errors.citation = 'المستند القانوني ورقم المادة مطلوب إلزامي للتوثيق';

  if (Object.keys(errors).length > 0) {
    state.ruleFormErrors = errors;
    renderApp();
    return;
  }

  if (state.editingRule) {
    const existing = window.MOCK.deadline_rules.find(r => r.id === state.editingRule.id);
    if (existing) {
      existing.rule_name = nameEl.value.trim();
      existing.trigger_event = triggerEl.value.trim();
      existing.duration = parseInt(durationEl.value);
      existing.duration_unit = unitEl.value;
      existing.citation = citationEl.value.trim();
    }
  } else {
    const newRule = {
      id: 'rule_' + (window.MOCK.deadline_rules.length + 701),
      rule_name: nameEl.value.trim(),
      trigger_event: triggerEl.value.trim(),
      duration: parseInt(durationEl.value),
      duration_unit: unitEl.value,
      citation: citationEl.value.trim(),
      active: true
    };
    window.MOCK.deadline_rules.push(newRule);
  }

  state.showRuleModal = false;
  state.editingRule = null;
  state.ruleFormErrors = {};
  showToast('تم حفظ قاعدة الميعاد القانوني بنجاح');
  renderApp();
}

// Master Render Function
export function renderApp() {
  const root = document.getElementById('root');
  if (!root) return;

  const urgentAlerts = getUrgentAlerts();
  const activeDeadlines = window.MOCK.deadlines.filter(d => d.status === 'provisional').length;
  const pendingReviewDocs = window.MOCK.documents.filter(d => d.ocr_status === 'review').length;

  root.innerHTML = `
    <div class="app-layout">
      <!-- Right Navigation Sidebar (RTL) -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="firm-brand">
            <div class="firm-logo">ع</div>
            <div>
              <div class="firm-title">العدل للاستشارات القانونية</div>
              <div class="firm-subtitle">منظومة إدارة التقاضي والمحاكم</div>
            </div>
          </div>
        </div>

        <ul class="nav-links">
          <li class="nav-item ${state.activeScreen === 'dashboard' ? 'active' : ''}">
            <button data-action="nav-screen" data-screen="dashboard">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </span>
              <span>لوحة المتابعة</span>
            </button>
          </li>
          <li class="nav-item ${state.activeScreen === 'matters' || state.activeScreen === 'matter-detail' ? 'active' : ''}">
            <button data-action="nav-screen" data-screen="matters">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path><path d="M6 6h10"></path><path d="M6 10h10"></path></svg>
              </span>
              <span>القضايا</span>
              <span class="nav-badge"><bdi>${window.MOCK.matters.length}</bdi></span>
            </button>
          </li>
          <li class="nav-item ${state.activeScreen === 'generator' ? 'active' : ''}">
            <button data-action="nav-screen" data-screen="generator">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </span>
              <span>توليد وثيقة قانونية</span>
              <span class="chip" style="background:var(--text-2); color:#fff; font-size:10px; padding:1px 6px;">ذكاء اصطناعي</span>
            </button>
          </li>
          <li class="nav-item ${state.activeScreen === 'roll' ? 'active' : ''}">
            <button data-action="nav-screen" data-screen="roll">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </span>
              <span>رول الجلسات</span>
              <span class="nav-badge"><bdi>${window.MOCK.hearings.filter(h => h.hearing_date === '2026-08-22').length}</bdi></span>
            </button>
          </li>
          <li class="nav-item ${state.activeScreen === 'deadlines' ? 'active' : ''}">
            <button data-action="nav-screen" data-screen="deadlines">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </span>
              <span>المواعيد</span>
              ${activeDeadlines > 0 ? `<span class="nav-badge danger"><bdi>${activeDeadlines}</bdi> مبدئي</span>` : ''}
            </button>
          </li>
          <li class="nav-item ${state.activeScreen === 'upload' ? 'active' : ''}">
            <button data-action="nav-screen" data-screen="upload">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </span>
              <span>رفع المستندات (PDF)</span>
            </button>
          </li>
          <li class="nav-item ${state.activeScreen === 'review' ? 'active' : ''}">
            <button data-action="nav-screen" data-screen="review">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              </span>
              <span>المراجعة</span>
              ${pendingReviewDocs > 0 ? `<span class="nav-badge danger"><bdi>${pendingReviewDocs}</bdi></span>` : ''}
            </button>
          </li>
          <li class="nav-item ${state.activeScreen === 'search' ? 'active' : ''}">
            <button data-action="nav-screen" data-screen="search">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <span>البحث في الأرشيف</span>
            </button>
          </li>
          <li class="nav-item ${state.activeScreen === 'rules' ? 'active' : ''}">
            <button data-action="nav-screen" data-screen="rules">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </span>
              <span>قواعد المواعيد</span>
            </button>
          </li>
        </ul>

        <div class="sidebar-footer">
          <div class="lawyer-profile">
            <div class="avatar">أح</div>
            <div>
              <div class="lawyer-name">أ/ أحمد عبد الرحمن</div>
              <div class="lawyer-role">محامٍ بالاستئناف العالي ومجلس الدولة</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Application Wrapper -->
      <div class="main-wrapper">
        <!-- Top App Bar -->
        <header class="top-bar">
          <div class="top-bar-start">
            <div class="search-input-wrapper">
              <span class="search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input type="text" placeholder="بحث سريع برقم الدعوى، اسم الموكل، أو المحكمة..." data-action="matter-search" value="${state.matterSearchQuery}">
            </div>
          </div>

          <div class="top-bar-actions">
            <button class="icon-btn" data-action="toggle-theme" title="تبديل النمط النهاري / الليلي">
              ${state.theme === 'light' ? `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ` : `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              `}
            </button>

            <!-- Notifications Bell with Real Counter Badge -->
            <div class="notif-wrapper">
              <button class="icon-btn" data-action="toggle-notifs" title="تنبيهات الجلسات والمواعيد القريبة (< 3 أيام)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                ${urgentAlerts.totalCount > 0 ? `
                  <span class="notif-badge notif-badge-pulse"><bdi>${urgentAlerts.totalCount}</bdi></span>
                ` : ''}
              </button>

              ${state.showNotifDropdown ? renderNotificationDropdown(state) : ''}
            </div>
          </div>
        </header>

        <!-- Page Container -->
        <main class="page-container">
          ${renderCurrentScreen()}
        </main>
      </div>
    </div>

    <!-- Rule Editor Modal -->
    ${state.showRuleModal ? renderRuleModal() : ''}

    <!-- Toast Notification -->
    ${state.toastMessage ? `<div class="app-toast"><span>🔔</span><span>${state.toastMessage}</span></div>` : ''}
  `;
}

function renderCurrentScreen() {
  switch (state.activeScreen) {
    case 'dashboard':
      return renderDashboardScreen();
    case 'matters':
      return renderMatterListScreen();
    case 'matter-detail':
      return renderMatterDetailScreen();
    case 'generator':
      return renderDocumentGeneratorScreen(state);
    case 'roll':
      return renderHearingRollScreen();
    case 'deadlines':
      return renderDeadlinesScreen();
    case 'upload':
      return renderUploadScreen();
    case 'review':
      return renderReviewQueueScreen();
    case 'search':
      return renderArchiveSearchScreen(state);
    case 'rules':
      return renderRulesEditorScreen();
    default:
      return renderDashboardScreen();
  }
}

// 1. Dashboard Screen
function renderDashboardScreen() {
  const todayHearings = window.MOCK.hearings.filter(h => h.hearing_date === '2026-08-22');
  const weekHearings = window.MOCK.hearings;
  const overdueDeadlines = window.MOCK.deadlines.filter(d => getDaysRemaining(d.due_date) < 0);
  const pendingReviewDocs = window.MOCK.documents.filter(d => d.ocr_status === 'review');
  const urgentAlerts = getUrgentAlerts();

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">لوحة المتابعة الإجرائية</h1>
        <div class="page-subtitle">السبت <bdi>٢٢ أغسطس ٢٠٢٦</bdi> — تقرير الرول والمواعيد الحتمية للفرع الرئيسي</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline" data-action="nav-screen" data-screen="generator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          توليد صحيفة / مذكرة
        </button>
        <button class="btn btn-primary" data-action="nav-screen" data-screen="roll">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
          استعراض رول اليوم
        </button>
      </div>
    </div>

    <!-- Urgent Notification Alert Banner (< 3 Days) -->
    ${urgentAlerts.totalCount > 0 ? `
      <div style="background:linear-gradient(135deg, rgba(195, 39, 44, 0.08), rgba(217, 114, 10, 0.08)); border:1px solid rgba(195, 39, 44, 0.3); border-radius:var(--radius-lg); padding:14px 18px; margin-block-end:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:36px; height:36px; border-radius:50%; background:var(--danger); color:#fff; display:flex; align-items:center; justify-content:center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
          <div>
            <div style="font-size:14px; font-weight:700; color:var(--text);">
              تنبيه حتمي: يوجد <bdi>${urgentAlerts.totalCount}</bdi> إجراءات قضائية وجلسات خلال أقل من ٣ أيام
            </div>
            <div style="font-size:12px; color:var(--text-dim);">
              تشمل <bdi>${urgentAlerts.hearings.length}</bdi> جلسات محكمة و <bdi>${urgentAlerts.deadlines.length}</bdi> مواعيد قانونية ملزمة
            </div>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary btn-sm" data-action="toggle-notifs">
            استعراض التنبيهات بالتفصيل
          </button>
        </div>
      </div>
    ` : ''}

    <!-- Five Stat Tiles -->
    <div class="stat-grid">
      <div class="stat-tile">
        <div class="stat-label">جلسات اليوم</div>
        <div class="stat-number"><bdi>${todayHearings.length}</bdi></div>
        <div class="stat-sub">في ٣ محاكم مختلفة</div>
      </div>
      <div class="stat-tile">
        <div class="stat-label">جلسات هذا الأسبوع</div>
        <div class="stat-number"><bdi>${weekHearings.length}</bdi></div>
        <div class="stat-sub">من ٢٢ إلى ٢٨ أغسطس</div>
      </div>
      <div class="stat-tile ${overdueDeadlines.length > 0 ? 'alert-tile' : ''}">
        <div class="stat-label">مواعيد متأخرة</div>
        <div class="stat-number"><bdi>${overdueDeadlines.length}</bdi></div>
        <div class="stat-sub">تتطلب اتخاذ إجراء فوري</div>
      </div>
      <div class="stat-tile">
        <div class="stat-label">مستندات بانتظار المراجعة</div>
        <div class="stat-number"><bdi>${pendingReviewDocs.length}</bdi></div>
        <div class="stat-sub">مستخرجة آلياً عبر الذكاء الاصطناعي</div>
      </div>
      <div class="stat-tile">
        <div class="stat-label">قوالب الصياغة المعتمدة</div>
        <div class="stat-number"><bdi>${window.MOCK.templates?.length || 4}</bdi></div>
        <div class="stat-sub">جاهزة للتوليد والدمج</div>
      </div>
    </div>

    <!-- Two-Column Layout -->
    <div class="dashboard-columns">
      <!-- Column 1: Today's Hearings Timeline -->
      <div class="dash-panel">
        <div class="panel-head">
          <div class="panel-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            جدول جلسات اليوم (<bdi>٢٢ أغسطس</bdi>)
          </div>
          <span class="panel-count"><bdi>${todayHearings.length}</bdi> جلسات</span>
        </div>

        <div class="timeline-list">
          ${todayHearings.map(h => {
            const m = window.MOCK.matters.find(item => item.id === h.matter_id) || {};
            return `
              <div class="timeline-item">
                <div class="time-badge"><bdi>${h.hearing_time}</bdi></div>
                <div class="timeline-content">
                  <div class="timeline-matter-num" data-action="open-matter" data-matter-id="${h.matter_id}">
                    ${formatCaseNumber(m.case_number || 'دعوى')} — ${m.court || h.court} (${m.circuit || h.circuit})
                  </div>
                  <div class="timeline-detail">
                    <strong>الموكل:</strong> ${m.client_name || '—'} | <strong>الخصم:</strong> ${m.opponent_name || '—'}
                  </div>
                  <div class="timeline-sub">
                    <strong>قرار الجلسة السابقة:</strong> ${h.adjournment_reason}
                  </div>
                  <div style="margin-block-start:6px; display:flex; gap:6px;">
                    <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 8px;" data-action="open-generator-for-matter" data-matter-id="${h.matter_id}">
                      توليد مذكرة للجلسة
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Column 2: Legal Deadlines & AI Archive Highlights -->
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="dash-panel">
          <div class="panel-head">
            <div class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              المواعيد القانونية الحتمية
            </div>
            <button class="btn btn-outline btn-sm" data-action="nav-screen" data-screen="deadlines">عرض الكل</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;">
            ${window.MOCK.deadlines.slice(0, 3).map(dl => {
              const m = window.MOCK.matters.find(item => item.id === dl.matter_id) || {};
              const days = getDaysRemaining(dl.due_date);
              const isOverdue = days < 0;
              const isProvisional = dl.status === 'provisional';

              return `
                <div class="deadline-row ${isOverdue ? 'overdue' : (days <= 7 ? 'this-week' : 'upcoming')}">
                  <div class="deadline-info">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                      <span class="deadline-title">${dl.title}</span>
                      <span class="chip ${isProvisional ? 'chip-provisional' : 'chip-confirmed'}">
                        ${isProvisional ? 'مبدئي (يتطلب تأكيد)' : 'مؤكد'}
                      </span>
                    </div>
                    <div class="deadline-meta">
                      <span>${formatCaseNumber(m.case_number || '')}</span>
                      <span>الاستحقاق: ${formatDate(dl.due_date)} (${isOverdue ? `<span class="chip-overdue-days">متأخر <bdi>${Math.abs(days)}</bdi> يوم</span>` : `متبقي <bdi>${days}</bdi> يوم`})</span>
                      <span class="citation-tag">${dl.rule_citation}</span>
                    </div>
                  </div>
                  ${isProvisional ? `
                    <button class="btn btn-good btn-sm" data-action="confirm-deadline" data-deadline-id="${dl.id}">
                      تأكيد الميعاد
                    </button>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- AI Legal Precedents Card in Dashboard -->
        <div class="dash-panel" style="border-inline-start:3px solid var(--text-2);">
          <div class="panel-head">
            <div class="panel-title" style="color:var(--text-2);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
              ملخص الذكاء الاصطناعي لأهم السوابق بالأرشيف
            </div>
            <button class="btn btn-outline btn-sm" data-action="nav-screen" data-screen="search">استكشاف الأرشيف</button>
          </div>

          <div style="font-size:13px; color:var(--text); line-height:1.7;">
            ${window.MOCK.archive_corpus[0]?.ai_summary || 'تطبيق قواعد المسؤولية العقدية وجواز توقيع غرامات التأخير الاتفاقية عند الإخلال بالجدول الزمني.'}
            <div style="margin-block-start:6px; font-size:12px; color:var(--text-dim);">
              <strong>المستند المستند إليه:</strong> ${window.MOCK.archive_corpus[0]?.matter_title}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 2. Matter List Screen
function renderMatterListScreen() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">قائمة القضايا والملفات</h1>
        <div class="page-subtitle">إجمالي <bdi>${window.MOCK.matters.length}</bdi> ملفات دعاوى متداولة ومقيدة</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline" data-action="nav-screen" data-screen="generator">
          ✨ توليد وثيقة لقضية
        </button>
        <button class="btn btn-primary" data-action="nav-screen" data-screen="upload">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          رفع ملف دعوى (PDF)
        </button>
      </div>
    </div>

    <div class="table-card">
      <div class="filter-bar">
        <input type="text" class="filter-input" placeholder="بحث برقم الدعوى أو الأطراف..." data-action="matter-search" value="${state.matterSearchQuery}">
        
        <select class="filter-select" id="filter-court" onchange="window.handleCourtFilter(this.value)">
          <option value="all">كل المحاكم</option>
          <option value="محكمة استئناف القاهرة">استئناف القاهرة</option>
          <option value="محكمة جنوب القاهرة">جنوب القاهرة</option>
          <option value="محكمة النقض">محكمة النقض</option>
          <option value="محكمة القاهرة الاقتصادية">القاهرة الاقتصادية</option>
          <option value="مجلس الدولة">مجلس الدولة</option>
        </select>

        <select class="filter-select" id="filter-stage">
          <option value="all">كل المراحل</option>
          <option value="أول درجة">أول درجة</option>
          <option value="استئناف">استئناف</option>
          <option value="نقض">نقض</option>
          <option value="قضاء إداري">قضاء إداري</option>
        </select>

        <select class="filter-select" id="filter-status">
          <option value="all">كل الحالات</option>
          <option value="متداولة">متداولة</option>
          <option value="محجوزة للحكم">محجوزة للحكم</option>
          <option value="محكوم فيها">محكوم فيها</option>
        </select>

        <span style="margin-inline-start:auto; font-size:12px; color:var(--text-dim);">
          عرض <bdi>${getFilteredMatters().length}</bdi> قضية
        </span>
      </div>

      <div class="table-wrapper" id="matters-table-container">
        ${renderMatterListTableHTML()}
      </div>
    </div>
  `;
}

function getFilteredMatters() {
  return window.MOCK.matters.filter(m => {
    if (state.matterSearchQuery) {
      const q = state.matterSearchQuery.toLowerCase();
      const match = m.case_number.toLowerCase().includes(q) ||
                    m.client_name.toLowerCase().includes(q) ||
                    m.opponent_name.toLowerCase().includes(q) ||
                    m.court.toLowerCase().includes(q) ||
                    m.subject.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

function renderMatterListTableHTML() {
  const filtered = getFilteredMatters();
  return `
    <table class="dense-table">
      <thead>
        <tr>
          <th class="sortable">رقم الدعوى</th>
          <th>المحكمة والدائرة</th>
          <th>الموكل</th>
          <th>الخصم</th>
          <th>المرحلة</th>
          <th>الجلسة القادمة</th>
          <th>المحامي المسؤول</th>
          <th>الحالة</th>
          <th>الإجراء</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(m => `
          <tr data-action="open-matter" data-matter-id="${m.id}">
            <td class="cell-matter-num">${formatCaseNumber(m.case_number)}</td>
            <td>${m.court} — ${m.circuit}</td>
            <td><strong>${m.client_name}</strong></td>
            <td>${m.opponent_name}</td>
            <td><span class="chip chip-stage">${m.stage}</span></td>
            <td><bdi>${m.next_hearing_date}</bdi></td>
            <td>${m.assigned_to}</td>
            <td>
              <span class="chip ${m.status === 'متداولة' ? 'chip-confirmed' : 'chip-stage'}">${m.status}</span>
            </td>
            <td onclick="event.stopPropagation();">
              <button class="btn btn-outline btn-sm" data-action="open-generator-for-matter" data-matter-id="${m.id}" title="توليد صحيفة أو مذكرة للقضية">
                ✍️ صياغة
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderMatterListTable() {
  const container = document.getElementById('matters-table-container');
  if (container) {
    container.innerHTML = renderMatterListTableHTML();
  }
}

// 3. Matter Detail Screen
function renderMatterDetailScreen() {
  const m = window.MOCK.matters.find(item => item.id === state.activeMatterId) || window.MOCK.matters[0];
  const matterHearings = window.MOCK.hearings.filter(h => h.matter_id === m.id);
  const matterDocs = window.MOCK.documents.filter(d => d.matter_id === m.id);
  const matterChron = window.MOCK.chronology.filter(c => c.matter_id === m.id);
  const matterDeadlines = window.MOCK.deadlines.filter(d => d.matter_id === m.id);

  return `
    <div class="matter-header-card">
      <div class="matter-header-top">
        <div>
          <div style="font-size:12px; color:var(--text-dim); margin-block-end:4px;">
            <button class="btn btn-outline btn-sm" data-action="nav-screen" data-screen="matters">
              &rarr; العودة لقائمة القضايا
            </button>
          </div>
          <h1 class="matter-headline">
            ${m.subject} — <span style="font-family:var(--font-mono); color:var(--text);">${formatCaseNumber(m.case_number)}</span>
          </h1>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline btn-sm" data-action="open-generator-for-matter" data-matter-id="${m.id}">
            ✨ توليد وثيقة لهذه القضية
          </button>
          <span class="chip chip-confirmed" style="font-size:14px; padding-inline:14px;">${m.status}</span>
        </div>
      </div>

      <div class="matter-meta-row">
        <div class="meta-item">
          <strong>المحكمة:</strong> ${m.court} (${m.circuit})
        </div>
        <div class="meta-item">
          <strong>المرحلة:</strong> <span class="chip chip-stage">${m.stage}</span>
        </div>
        <div class="meta-item">
          <strong>المحامي المسؤول:</strong> ${m.assigned_to}
        </div>
        <div class="meta-item">
          <strong>الجلسة القادمة:</strong> <bdi style="font-weight:700; color:var(--accent);">${m.next_hearing_date}</bdi>
        </div>
      </div>
    </div>

    <!-- Six Tabs Nav -->
    <div class="tabs-nav">
      <button class="tab-btn ${state.matterActiveTab === 'overview' ? 'active' : ''}" data-action="switch-matter-tab" data-tab="overview">نظرة عامة</button>
      <button class="tab-btn ${state.matterActiveTab === 'parties' ? 'active' : ''}" data-action="switch-matter-tab" data-tab="parties">الأطراف</button>
      <button class="tab-btn ${state.matterActiveTab === 'hearings' ? 'active' : ''}" data-action="switch-matter-tab" data-tab="hearings">الجلسات (<bdi>${matterHearings.length}</bdi>)</button>
      <button class="tab-btn ${state.matterActiveTab === 'documents' ? 'active' : ''}" data-action="switch-matter-tab" data-tab="documents">المستندات (<bdi>${matterDocs.length}</bdi>)</button>
      <button class="tab-btn ${state.matterActiveTab === 'chronology' ? 'active' : ''}" data-action="switch-matter-tab" data-tab="chronology">سرد الوقائع (<bdi>${matterChron.length}</bdi>)</button>
      <button class="tab-btn ${state.matterActiveTab === 'deadlines' ? 'active' : ''}" data-action="switch-matter-tab" data-tab="deadlines">المواعيد (<bdi>${matterDeadlines.length}</bdi>)</button>
    </div>

    <!-- Tab Contents -->
    <div class="tab-content">
      ${renderMatterTabContent(m, matterHearings, matterDocs, matterChron, matterDeadlines)}
    </div>
  `;
}

function renderMatterTabContent(m, hearings, docs, chron, deadlines) {
  switch (state.matterActiveTab) {
    case 'overview':
      return `
        <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:20px;">
          <div class="dash-panel">
            <h3 class="doc-heading" style="font-size:18px;">موضوع الدعوى والطلبات</h3>
            <p style="font-size:14px; color:var(--text); line-height:1.8;">
              ${m.subject}. تطالب الجهة الموكلة بالتعويض عن الإخلال بالجدول الزمني المعتمد للأعمال الإنشائية واسترداد خطابات الضمان غير المبرأة، مع إلزام المدعى عليه بسداد فوائد التأخير القانونية بنسبة ٥٪ سنوياً من تاريخ المطالبة القضائية وحتى تمام السداد الفعلي.
            </p>
            <div style="margin-block-start:14px; padding:12px; background:var(--inset); border-radius:var(--radius-sm);">
              <strong>الدفوع القانونية الأساسية:</strong> الدفع بسقوط الحق في الدفع بعدم التنفيذ طبقاً للمادة ١٦١ مدني، والدفع بالبطلان الإجرائي لإعادة الإعلان.
            </div>
            <div style="margin-block-start:12px;">
              <button class="btn btn-primary btn-sm" data-action="open-generator-for-matter" data-matter-id="${m.id}">
                ✍️ صياغة صحيفة استئناف أو مذكرة دفاع فورية
              </button>
            </div>
          </div>

          <div class="dash-panel">
            <h3 class="doc-heading" style="font-size:18px;">بيانات القيد والتسجيل</h3>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:13px;">
              <div><strong>السنة القضائية:</strong> <bdi>${m.case_year}</bdi></div>
              <div><strong>رقم القيد بجدول المحكمة:</strong> <bdi>${m.case_number}</bdi></div>
              <div><strong>الدائرة المختصة:</strong> ${m.circuit}</div>
              <div><strong>تاريخ إيداع الصحيفة:</strong> <bdi>2025-07-14</bdi></div>
              <div><strong>حالة الرول الإلكتروني:</strong> <span class="chip chip-confirmed">مسجلة بالمنظومة القضائية</span></div>
            </div>
          </div>
        </div>
      `;

    case 'parties':
      return `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
          <div class="dash-panel">
            <div class="panel-head">
              <div class="panel-title" style="color:var(--good);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                المدعي (الموكل)
              </div>
              <span class="chip chip-confirmed">طالب الحق</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:14px;">
              <div><strong>الاسم الكامل:</strong> ${m.client_name}</div>
              <div><strong>الصفة:</strong> الممثل القانوني للشركة (رئيس مجلس الإدارة)</div>
              <div><strong>السجل التجاري:</strong> <bdi>٤٨٢٩٠١</bdi> استثمار القاهرة</div>
              <div><strong>محل الإقامة المختار:</strong> مكتب الأستاذ / أحمد عبد الرحمن المحامي</div>
            </div>
          </div>

          <div class="dash-panel">
            <div class="panel-head">
              <div class="panel-title" style="color:var(--danger);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                المدعى عليه (الخصم)
              </div>
              <span class="chip chip-stage">المطلوب ضده</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:14px;">
              <div><strong>الاسم الكامل:</strong> ${m.opponent_name}</div>
              <div><strong>الصفة:</strong> بصفته الممثل القانوني للمجموعة</div>
              <div><strong>موطن الإعلان الأصلي:</strong> ٢٤ شارع مصدق - الدقي - الجيزة</div>
              <div><strong>حالة الإعلان:</strong> <span class="chip chip-confirmed">تم الإعلان لجهة الإدارة</span></div>
            </div>
          </div>
        </div>
      `;

    case 'hearings':
      return `
        <div class="table-card">
          <table class="dense-table">
            <thead>
              <tr>
                <th>تاريخ الجلسة</th>
                <th>الوقت</th>
                <th>المحكمة والدائرة</th>
                <th>قرار الجلسة / سبب التأجيل</th>
                <th>القرار اللاحق</th>
              </tr>
            </thead>
            <tbody>
              ${hearings.map(h => `
                <tr>
                  <td><bdi>${h.hearing_date}</bdi></td>
                  <td><bdi>${h.hearing_time}</bdi></td>
                  <td>${h.court} (${h.circuit})</td>
                  <td>${h.adjournment_reason}</td>
                  <td><span class="chip chip-stage">${h.next_date ? `مؤجلة لجلسة <bdi>${h.next_date}</bdi>` : 'حكم تمهيدي'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

    case 'documents':
      return `
        <div class="table-card">
          <table class="dense-table">
            <thead>
              <tr>
                <th>اسم المستند</th>
                <th>عدد الصفحات</th>
                <th>تاريخ الرفع</th>
                <th>حالة الاستخراج الآلي (OCR)</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              ${docs.map(d => `
                <tr>
                  <td><strong>${d.filename}</strong></td>
                  <td><bdi>${d.page_count}</bdi> ص</td>
                  <td><bdi>${d.uploaded_at}</bdi></td>
                  <td>
                    <span class="chip ${d.ocr_status === 'done' ? 'chip-confirmed' : (d.ocr_status === 'review' ? 'chip-provisional' : 'chip-stage')}">
                      ${d.ocr_status === 'review' ? 'بانتظار المراجعة' : (d.ocr_status === 'done' ? 'تم الاعتماد' : 'جاري المعالجة')}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-outline btn-sm" data-action="open-review-doc" data-doc-id="${d.id}">
                      فتح شاشة المراجعة
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

    case 'chronology':
      return renderChronologyView(chron);

    case 'deadlines':
      return `
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${deadlines.map(dl => {
            const isProvisional = dl.status === 'provisional';
            return `
              <div class="deadline-row ${isProvisional ? 'this-week' : 'upcoming'}">
                <div class="deadline-info">
                  <div style="display:flex; align-items:center; justify-content:space-between;">
                    <span class="deadline-title">${dl.title}</span>
                    <span class="chip ${isProvisional ? 'chip-provisional' : 'chip-confirmed'}">
                      ${isProvisional ? 'مبدئي' : 'مؤكد'}
                    </span>
                  </div>
                  <div class="deadline-meta">
                    <span>الاستحقاق: ${formatDate(dl.due_date)}</span>
                    <span>الحدث المُشغِّل: ${dl.trigger_event} (<bdi>${dl.trigger_date}</bdi>)</span>
                    <span class="citation-tag">${dl.rule_citation}</span>
                  </div>
                </div>
                ${isProvisional ? `
                  <button class="btn btn-good btn-sm" data-action="confirm-deadline" data-deadline-id="${dl.id}">
                    تأكيد الميعاد
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
  }
}

// 4. Chronology Timeline
function renderChronologyView(chronEntries) {
  const grouped = {};
  chronEntries.forEach(entry => {
    const year = entry.event_date.split('-')[0];
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(entry);
  });

  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return `
    <div class="chronology-tree">
      ${years.map(yr => `
        <div class="chron-year-block">
          <div class="chron-year-badge"><bdi>${yr}</bdi></div>
          <div style="display:flex; flex-direction:column; gap:16px; margin-block-start:8px;">
            ${grouped[yr].map(item => `
              <div class="chron-entry">
                <div class="chron-date"><bdi>${item.event_date}</bdi></div>
                <div class="chron-desc">
                  ${item.description}
                  <div style="margin-block-start:6px;">
                    <span class="chron-ref-chip" data-action="open-chronology-doc" data-doc-id="${item.document_id}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                      مستند <bdi>${item.document_id.replace('doc_', '')}</bdi> — صفحة <bdi>${item.page}</bdi>
                    </span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 5. Upload Screen with Intelligent PDF Extractor & Sample Presets
function renderUploadScreen() {
  const files = window.MOCK.documents;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">رفع ومعالجة ملفات القضايا (PDF)</h1>
        <div class="page-subtitle">محرك الذكاء الاصطناعي لاستخراج أرقام القضايا، تواريخ الجلسات، والمحاكم تلقائياً</div>
      </div>
    </div>

    <!-- Drag & Drop Zone -->
    <div class="upload-zone" data-action="trigger-upload">
      <input type="file" id="file-upload-input" style="display:none;" accept=".pdf,application/pdf" onchange="window.handleFileSelect(event)">
      <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
      <div class="upload-title">اسحب وأفلت ملف PDF أو انقر لاختيار ملف من جهازك</div>
      <div class="upload-desc">يقوم الذكاء الاصطناعي بقراءة النص الضوئي (OCR) واستخراج رقم الدعوى، تاريخ الجلسة، والمحكمة المختصة تلقائياً وتعبئتها في نموذج المراجعة.</div>
      <button class="btn btn-outline" style="margin-block-start:8px;">اختيار ملف PDF من الجهاز</button>
    </div>

    <!-- Quick PDF Presets For Instant Verification -->
    <div style="margin-block-start:20px;">
      <div style="font-size:13px; font-weight:700; color:var(--text); margin-block-end:8px; display:flex; align-items:center; gap:6px;">
        <span>📄 عينات ملفات PDF قانونية للاختبار الفوري السريع:</span>
      </div>
      <div class="upload-presets-grid">
        ${PDF_PRESETS.map(p => `
          <div class="upload-preset-card" data-action="process-preset-pdf" data-preset-id="${p.id}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <div style="flex:1; overflow:hidden;">
              <div style="font-size:12px; font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${p.filename}</div>
              <div style="font-size:10px; color:var(--text-dim);"><bdi>${p.page_count}</bdi> صفحات • استخراج ذكي فوري</div>
            </div>
            <span class="btn btn-outline btn-sm" style="font-size:10px; padding:2px 6px;">معالجة</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Files in Processing Pipeline -->
    <div class="progress-list" style="margin-block-start:24px;">
      <h3 class="doc-heading" style="font-size:18px;">المستندات وسجل المعالجة</h3>

      ${files.map(f => {
        const stageIndex = f.ocr_status === 'queued' ? 1 : (f.ocr_status === 'reading' ? 2 : (f.ocr_status === 'extracting' ? 3 : 4));
        return `
          <div class="file-progress-card">
            <div class="file-info-row">
              <div class="filename">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                ${f.filename} (<bdi>${f.page_count}</bdi> صفحات)
              </div>
              <div>
                ${f.ocr_status === 'review' ? `
                  <button class="btn btn-primary btn-sm" data-action="open-review-doc" data-doc-id="${f.id}">
                    بدء المراجعة والاعتماد
                  </button>
                ` : `
                  <span class="chip chip-stage">${f.uploaded_at}</span>
                `}
              </div>
            </div>

            <!-- Stepper -->
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
                <div class="step-name">بانتظار المراجعة</div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 6. Review Queue Screen
function renderReviewQueueScreen() {
  const doc = window.MOCK.documents.find(d => d.id === state.activeDocumentId) || window.MOCK.documents[0];
  const extractions = window.MOCK.extractions.filter(x => x.document_id === doc.id);
  const activeExt = extractions.find(x => x.id === state.activeExtractionId) || extractions[0];

  const reviewedCount = extractions.filter(x => x.review_state !== 'pending').length;
  const totalCount = extractions.length;

  return `
    <div class="page-header" style="margin-block-end:16px;">
      <div>
        <h1 class="page-title">مراجعة الاستخراج الآلي والتحقق الإجرائي</h1>
        <div class="page-subtitle">المستند: <strong>${doc.filename}</strong> — تم استخراج البيانات عبر الذكاء الاصطناعي تلقائياً</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline btn-sm" data-action="accept-all-extractions">
          اعتماد الكل
        </button>
        <button class="btn btn-primary btn-sm" data-action="save-review-next">
          حفظ ومتابعة
        </button>
      </div>
    </div>

    <!-- Split View Container -->
    <div class="split-review-container">
      <!-- Right Pane (RTL): Scanned Page Mock with Bounding Box Overlay -->
      <div class="doc-viewer-pane">
        <div class="doc-viewer-header">
          <span>معاينة الصفحة <bdi>${activeExt ? activeExt.page : 1}</bdi> من <bdi>${doc.page_count}</bdi></span>
          <span style="font-size:12px; color:var(--text-dim);">تكبير: <bdi>100%</bdi></span>
        </div>

        <div class="doc-canvas-area">
          <div class="doc-page-mock" id="scanned-page-container">
            <div style="text-align:center; font-weight:700; font-size:15px; margin-block-end:12px; border-block-end:1px solid #ddd; padding-block-end:8px;">
              جمهورية مصر العربية — وزارة العدل<br>محكمة استئناف القاهرة
            </div>
            
            <div style="margin-block-end:10px;">
              <strong>رقم الدعوى:</strong> <bdi>٤١٢٩ لسنة ٢٠٢٥ تجاري</bdi><br>
              <strong>الدائرة:</strong> السابعة استئناف تجاري شمال القاهرة
            </div>

            <div style="margin-block-end:10px;">
              <strong>بناءً على طلب:</strong> شركة النيل للاستثمار العقاري (ش.م.م)، وموطنها المختار مكتب الأستاذ / أحمد عبد الرحمن المحامي.<br>
              <strong>أنا محضر محكمة:</strong> الدقي الجزئية قد انتقلت وأعلنت:
            </div>

            <div style="margin-block-end:10px;">
              <strong>المعلن إليه:</strong> الممثل القانوني لمجموعة الأهرام للمقاولات العامة، بمقرها الكائن بالدقي.<br>
              <strong>الموضوع:</strong> إعلان بصحيفة استئناف الحكم الصادر في الدعوى رقم ٨١٠ لسنة ٢٠٢٤.
            </div>

            <div style="margin-block-end:10px;">
              <strong>وقائع النزاع:</strong> حيث تداين الطالبة المعلن إليه بمبلغ <bdi>١٨,٥٠٠,٠٠٠</bdi> جنيه مصري قيمة الدفعة الختامية وتعويض التأخير الاتفاقي...
            </div>

            <div style="position:absolute; bottom:25px; inset-inline-end:25px; font-size:10px; color:#555;">
              ختم قلم المحضرين — تاريخ الإعلان: <bdi>١٤ يوليو ٢٠٢٥</bdi>
            </div>

            <!-- Active Field Bounding Box Highlight -->
            ${activeExt && activeExt.bbox ? `
              <div class="doc-bbox-highlight" style="top:${activeExt.bbox.top}%; left:${activeExt.bbox.left}%; width:${activeExt.bbox.width}%; height:${activeExt.bbox.height}%;"></div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Left Pane (RTL): Extracted Fields with Confidence and Actions -->
      <div class="extractions-pane">
        <div class="extractions-header">
          <div>
            <strong>الحقول المستخرجة من المستند</strong>
            <div style="font-size:11px; color:var(--text-dim);">انقر على الحقل لتحديد موقعه بالصفحة</div>
          </div>
          <span class="chip chip-stage"><bdi>${reviewedCount}</bdi> من <bdi>${totalCount}</bdi> حقول</span>
        </div>

        <div class="extractions-list">
          ${extractions.map(ext => {
            const isSelected = activeExt && activeExt.id === ext.id;
            const confClass = ext.confidence >= 90 ? 'confidence-high' : (ext.confidence >= 70 ? 'confidence-mid' : 'confidence-low');

            return `
              <div class="extraction-row ${isSelected ? 'active' : ''} ${ext.review_state}" data-action="select-extraction" data-ext-id="${ext.id}">
                <div class="ext-top">
                  <span class="ext-field-name">${ext.field_name}</span>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="confidence-chip ${confClass}">
                      ثقة: <bdi>${ext.confidence}%</bdi>
                    </span>
                    <span class="chip ${ext.review_state === 'accepted' ? 'chip-confirmed' : (ext.review_state === 'corrected' ? 'chip-provisional' : (ext.review_state === 'rejected' ? 'chip-stage' : ''))}">
                      ${ext.review_state === 'accepted' ? 'تم القبول' : (ext.review_state === 'corrected' ? 'مصحح' : (ext.review_state === 'rejected' ? 'مرفوض' : 'بانتظار المراجعة'))}
                    </span>
                  </div>
                </div>

                <div>
                  <input type="text" class="ext-value-input" value="${ext.field_value}" data-ext-input="${ext.id}" onclick="event.stopPropagation();">
                </div>

                <div class="ext-actions-bar" onclick="event.stopPropagation();">
                  <button class="btn btn-good btn-sm" data-action="accept-extraction" data-ext-id="${ext.id}">
                    ✓ قبول
                  </button>
                  <button class="btn btn-warn btn-sm" data-action="correct-extraction" data-ext-id="${ext.id}">
                    ✏️ تصحيح
                  </button>
                  <button class="btn btn-danger btn-sm" data-action="reject-extraction" data-ext-id="${ext.id}">
                    ✕ رفض
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer Bar -->
        <div class="review-footer">
          <div style="font-size:13px; font-weight:600; color:var(--text);">
            <bdi>${reviewedCount}</bdi> من <bdi>${totalCount}</bdi> حقل تمت مراجعته
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-outline btn-sm" data-action="accept-all-extractions">اعتماد الكل</button>
            <button class="btn btn-primary btn-sm" data-action="save-review-next">حفظ ومتابعة</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 7. Hearing Roll Screen
function renderHearingRollScreen() {
  const selectedHearings = window.MOCK.hearings.filter(h => {
    if (state.rollFilterMineOnly && h.matter_id !== 'mat_101' && h.matter_id !== 'mat_104') return false;
    return h.hearing_date === state.rollSelectedDate;
  });

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">رول الجلسات والأجندة القضائية</h1>
        <div class="page-subtitle">جدول جلسات المحاكم وتوزيع المحامين</div>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
          <input type="checkbox" ${state.rollFilterMineOnly ? 'checked' : ''} data-action="toggle-my-hearings">
          <strong>جلساتي فقط (أ/ أحمد عبد الرحمن)</strong>
        </label>
      </div>
    </div>

    <div class="roll-layout">
      <!-- Calendar View -->
      <div class="calendar-card">
        <div class="cal-header">
          <h3 class="doc-heading" style="font-size:16px;">أغسطس <bdi>٢٠٢٦</bdi></h3>
          <span style="font-size:12px; color:var(--text-dim);">شهر المحاكمات</span>
        </div>

        <div class="cal-grid">
          <div class="cal-day-name">سبت</div>
          <div class="cal-day-name">أحد</div>
          <div class="cal-day-name">إثنين</div>
          <div class="cal-day-name">ثلاثاء</div>
          <div class="cal-day-name">أربعاء</div>
          <div class="cal-day-name">خميس</div>
          <div class="cal-day-name">جمعة</div>

          ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(day => {
            const dStr = `2026-08-${day.toString().padStart(2, '0')}`;
            const hasHearing = window.MOCK.hearings.some(h => h.hearing_date === dStr);
            const isSelected = state.rollSelectedDate === dStr;

            return `
              <div class="cal-day-cell ${isSelected ? 'selected' : ''} ${hasHearing ? 'has-hearings' : ''}" data-action="select-roll-date" data-date="${dStr}">
                <bdi>${day}</bdi>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-block-start:16px; font-size:12px; color:var(--text-dim); display:flex; align-items:center; gap:8px;">
          <span style="width:8px; height:8px; border-radius:50%; background:var(--accent); display:inline-block;"></span>
          يوجد جلسات مقررة
        </div>
      </div>

      <!-- Agenda List for Selected Day -->
      <div class="dash-panel">
        <div class="panel-head">
          <div class="panel-title">
            أجندة يوم: <bdi style="font-family:var(--font-mono); margin-inline-start:6px;">${state.rollSelectedDate}</bdi>
          </div>
          <span class="panel-count"><bdi>${selectedHearings.length}</bdi> جلسة</span>
        </div>

        <div class="timeline-list">
          ${selectedHearings.length === 0 ? `
            <div style="text-align:center; padding:32px; color:var(--text-dim);">لا توجد جلسات مجدولة في هذا اليوم المحدد.</div>
          ` : selectedHearings.map(h => {
            const m = window.MOCK.matters.find(item => item.id === h.matter_id) || {};
            return `
              <div class="timeline-item">
                <div class="time-badge"><bdi>${h.hearing_time}</bdi></div>
                <div class="timeline-content">
                  <div class="timeline-matter-num" data-action="open-matter" data-matter-id="${h.matter_id}">
                    ${formatCaseNumber(m.case_number || 'دعوى')} — ${h.court} (${h.circuit})
                  </div>
                  <div class="timeline-detail">
                    <strong>الموكل:</strong> ${m.client_name || '—'} | <strong>الخصم:</strong> ${m.opponent_name || '—'}
                  </div>
                  <div class="timeline-sub">
                    <strong>المحامي الحاضر:</strong> ${m.assigned_to || 'أ/ أحمد عبد الرحمن'}
                  </div>
                  <div style="font-size:12px; margin-block-start:4px; padding:6px 10px; background:var(--inset); border-radius:var(--radius-sm);">
                    <strong>قرار الجلسة السابقة:</strong> ${h.adjournment_reason}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// 8. Deadlines Screen
function renderDeadlinesScreen() {
  const overdue = window.MOCK.deadlines.filter(d => getDaysRemaining(d.due_date) < 0);
  const thisWeek = window.MOCK.deadlines.filter(d => {
    const days = getDaysRemaining(d.due_date);
    return days >= 0 && days <= 7;
  });
  const upcoming = window.MOCK.deadlines.filter(d => getDaysRemaining(d.due_date) > 7);

  const renderGroup = (items, title, badgeColor, borderStyle) => `
    <div style="margin-block-end:24px;">
      <div style="display:flex; align-items:center; gap:10px; margin-block-end:12px;">
        <h3 class="doc-heading" style="font-size:18px;">${title}</h3>
        <span class="chip" style="background:${badgeColor}; color:#fff; font-size:11px;"><bdi>${items.length}</bdi></span>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${items.length === 0 ? `
          <div style="font-size:13px; color:var(--text-dim); padding:12px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-sm);">لا توجد مواعيد في هذا القسم.</div>
        ` : items.map(dl => {
          const m = window.MOCK.matters.find(item => item.id === dl.matter_id) || {};
          const days = getDaysRemaining(dl.due_date);
          const isProvisional = dl.status === 'provisional';

          return `
            <div class="deadline-row ${borderStyle}">
              <div class="deadline-info">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                  <span class="deadline-title">${dl.title}</span>
                  <span class="chip ${isProvisional ? 'chip-provisional' : 'chip-confirmed'}">
                    ${isProvisional ? 'مبدئي (يتطلب تأكيد)' : 'مؤكد'}
                  </span>
                </div>
                <div class="deadline-meta">
                  <span style="cursor:pointer;" data-action="open-matter" data-matter-id="${m.id}">
                    <strong>القضية:</strong> ${formatCaseNumber(m.case_number || '')} — ${m.client_name || ''}
                  </span>
                  <span><strong>تاريخ الاستحقاق:</strong> ${formatDate(dl.due_date)}</span>
                  <span><strong>المتبقي:</strong> <bdi>${days < 0 ? `متأخر ${Math.abs(days)} يوم` : `${days} أيام`}</bdi></span>
                </div>
                <div class="deadline-meta" style="margin-block-start:4px;">
                  <span><strong>الحدث المُشغِّل:</strong> ${dl.trigger_event} (<bdi>${dl.trigger_date}</bdi>)</span>
                  <span class="citation-tag">${dl.rule_citation}</span>
                </div>
              </div>

              ${isProvisional ? `
                <button class="btn btn-good btn-sm" data-action="confirm-deadline" data-deadline-id="${dl.id}">
                  تأكيد الميعاد
                </button>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">حساب ومراقبة المواعيد الإجرائية</h1>
        <div class="page-subtitle">المواعيد مقسمة حسب الأولوية وتعتمد على النصوص القانونية وقانون المرافعات</div>
      </div>
    </div>

    ${renderGroup(overdue, 'مواعيد متأخرة', 'var(--danger)', 'overdue')}
    ${renderGroup(thisWeek, 'مواعيد هذا الأسبوع', 'var(--warn)', 'this-week')}
    ${renderGroup(upcoming, 'مواعيد قادمة', 'var(--good)', 'upcoming')}
  `;
}

// 9. Rules Editor Screen
function renderRulesEditorScreen() {
  const rules = window.MOCK.deadline_rules;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">قواعد حساب المواعيد القانونية</h1>
        <div class="page-subtitle">إدارة القواعد الإجرائية والمدد المنصوص عليها بقانون المرافعات والقوانين الخاصة</div>
      </div>
      <button class="btn btn-primary" data-action="open-rule-modal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        إضافة قاعدة جديدة
      </button>
    </div>

    <div class="table-card">
      <table class="dense-table">
        <thead>
          <tr>
            <th>اسم القاعدة</th>
            <th>الحدث المُشغِّل</th>
            <th>المدة القانونية</th>
            <th>المستند القانوني ورقم المادة</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${rules.map(r => `
            <tr>
              <td><strong>${r.rule_name}</strong></td>
              <td>${r.trigger_event}</td>
              <td><bdi>${r.duration}</bdi> ${r.duration_unit}</td>
              <td><span class="citation-tag">${r.citation}</span></td>
              <td>
                <span class="chip ${r.active ? 'chip-confirmed' : 'chip-stage'}">
                  ${r.active ? 'نشط' : 'معطل'}
                </span>
              </td>
              <td>
                <button class="btn btn-outline btn-sm" data-action="edit-rule" data-rule-id="${r.id}">
                  تعديل
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderRuleModal() {
  const r = state.editingRule || {
    rule_name: '',
    trigger_event: '',
    duration: 30,
    duration_unit: 'يوم',
    citation: '',
    active: true
  };
  const errs = state.ruleFormErrors || {};

  return `
    <div class="modal-overlay" data-action="close-rule-modal">
      <div class="modal-card" onclick="event.stopPropagation();">
        <div style="display:flex; align-items:center; justify-content:space-between; border-block-end:1px solid var(--border); padding-block-end:12px;">
          <h2 class="doc-heading" style="font-size:20px;">
            ${state.editingRule ? 'تعديل قاعدة ميعاد قانوني' : 'تعريف قاعدة ميعاد قانوني جديدة'}
          </h2>
          <button class="btn btn-outline btn-sm" data-action="close-rule-modal">✕</button>
        </div>

        <div class="form-group">
          <label class="form-label">اسم القاعدة الإجرائية *</label>
          <input type="text" class="form-input" id="rule-name-input" value="${r.rule_name}" placeholder="مثال: ميعاد استئناف الأحكام المدنية">
          ${errs.rule_name ? `<span class="form-error">${errs.rule_name}</span>` : ''}
        </div>

        <div class="form-group">
          <label class="form-label">الحدث المُشغِّل للميعاد *</label>
          <input type="text" class="form-input" id="rule-trigger-input" value="${r.trigger_event}" placeholder="مثال: صدور الحكم أو إعلانه">
          ${errs.trigger_event ? `<span class="form-error">${errs.trigger_event}</span>` : ''}
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div class="form-group">
            <label class="form-label">المدة *</label>
            <input type="number" class="form-input" id="rule-duration-input" value="${r.duration}" min="1">
            ${errs.duration ? `<span class="form-error">${errs.duration}</span>` : ''}
          </div>

          <div class="form-group">
            <label class="form-label">الوحدة</label>
            <select class="form-select" id="rule-unit-input">
              <option value="يوم" ${r.duration_unit === 'يوم' ? 'selected' : ''}>يوم</option>
              <option value="شهر" ${r.duration_unit === 'شهر' ? 'selected' : ''}>شهر</option>
              <option value="سنة" ${r.duration_unit === 'سنة' ? 'selected' : ''}>سنة</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">المستند القانوني ورقم المادة (إلزامي للتوثيق) *</label>
          <input type="text" class="form-input" id="rule-citation-input" value="${r.citation}" placeholder="مثال: المادة ٢٢٧ من قانون المرافعات المدنية والتجارية">
          <span class="form-hint">يجب توثيق كل قاعدة بالنص القانوني الحاكم لتظهر في بطاقات المواعيد.</span>
          ${errs.citation ? `<span class="form-error">${errs.citation}</span>` : ''}
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-block-start:12px;">
          <button class="btn btn-outline" data-action="close-rule-modal">إلغاء</button>
          <button class="btn btn-primary" data-action="save-rule">حفظ القاعدة</button>
        </div>
      </div>
    </div>
  `;
}

// Global window event hooks for inline change listeners
window.handleCourtFilter = function(val) {
  state.matterFilterCourt = val;
  renderMatterListTable();
};

window.handleGeneratorMatterChange = function(val) {
  state.activeMatterId = val;
  state.generatorCustomVars = {};
  renderApp();
};

window.handleGeneratorTemplateChange = function(val) {
  state.generatorTemplateId = val;
  renderApp();
};

window.printLegalDocument = function() {
  window.print();
};

window.handleFileSelect = function(event) {
  const file = event.target.files?.[0];
  if (file) {
    processUploadedPdf(file, state);
    showToast(`تم استخراج بيانات ملف ${file.name} بالذكاء الاصطناعي بنجاح`);
    renderApp();
  }
};
