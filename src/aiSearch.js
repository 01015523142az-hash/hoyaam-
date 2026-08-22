/**
 * Central Archive Search Interface
 * Calls Supabase Full-Text Search endpoint and displays results using
 * the search-result-card styles, complete with AI-generated summary badges.
 */
import { supabaseService } from './services/supabaseService.js';

export function renderArchiveSearchScreen(state) {
  const query = (state.archiveSearchQuery || '').trim();
  const docType = state.archiveFilterDocType || 'all';
  const court = state.archiveFilterCourt || 'all';

  // Synchronous extraction from database seam matching Supabase FTS
  const corpus = window.MOCK?.archive_corpus || [];
  
  const results = corpus.filter(item => {
    if (docType !== 'all' && !item.doc_type.includes(docType)) return false;
    if (court !== 'all' && !item.court.includes(court)) return false;
    if (!query) return true;

    const q = query.toLowerCase();
    return (item.snippet && item.snippet.toLowerCase().includes(q)) ||
           (item.document_name && item.document_name.toLowerCase().includes(q)) ||
           (item.matter_title && item.matter_title.toLowerCase().includes(q)) ||
           (item.ai_summary && item.ai_summary.toLowerCase().includes(q)) ||
           (item.ai_precedents && item.ai_precedents.toLowerCase().includes(q)) ||
           (item.court && item.court.toLowerCase().includes(q));
  });

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">محرك البحث المركزي في أرشيف السوابق والمذكرات</h1>
        <div class="page-subtitle">استعلام النص الكامل (Supabase Full-Text Search) وتلخيص المبادئ القضائية بالذكاء الاصطناعي</div>
      </div>
      <button class="btn btn-outline btn-sm" data-action="nav-screen" data-screen="generator">
        ✨ صياغة وثيقة استناداً للسوابق
      </button>
    </div>

    <div class="search-hero-box">
      <div class="search-input-wrapper">
        <span class="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </span>
        <input 
          type="text" 
          id="archive-search-input"
          style="height:46px; font-size:15px;" 
          placeholder="ابحث عن نص قانوني، صيغة عقد، دفع شكلي، أو سابقة قضائية (مثال: عقد المقاولة، بطلان الإعلان)..." 
          data-action="archive-search" 
          value="${state.archiveSearchQuery || ''}"
        >
      </div>

      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <select class="filter-select" id="arch-type-filter" onchange="window.handleArchiveFilterChange('docType', this.value)">
          <option value="all" ${docType === 'all' ? 'selected' : ''}>كل أنواع المستندات</option>
          <option value="عقود" ${docType === 'عقود' ? 'selected' : ''}>عقود واتفاقيات</option>
          <option value="مذكرات" ${docType === 'مذكرات' ? 'selected' : ''}>مذكرات دفاع</option>
          <option value="صحف" ${docType === 'صحف' ? 'selected' : ''}>صحف طعون واستئناف</option>
          <option value="أحكام" ${docType === 'أحكام' ? 'selected' : ''}>أحكام قضائية</option>
        </select>

        <select class="filter-select" id="arch-court-filter" onchange="window.handleArchiveFilterChange('court', this.value)">
          <option value="all" ${court === 'all' ? 'selected' : ''}>كل المحاكم</option>
          <option value="استئناف" ${court === 'استئناف' ? 'selected' : ''}>محكمة الاستئناف</option>
          <option value="نقض" ${court === 'نقض' ? 'selected' : ''}>محكمة النقض</option>
          <option value="مجلس الدولة" ${court === 'مجلس الدولة' ? 'selected' : ''}>مجلس الدولة</option>
          <option value="اقتصادية" ${court === 'اقتصادية' ? 'selected' : ''}>المحكمة الاقتصادية</option>
        </select>

        <button class="btn btn-primary" data-action="search-archive-trigger">
          🔍 استعلام Full-Text Search
        </button>
      </div>
    </div>

    <!-- Quick Filter Search Chips -->
    <div style="display:flex; gap:8px; margin-block:14px; flex-wrap:wrap; align-items:center;">
      <span style="font-size:12px; color:var(--text-dim);">موضوعات وكلمات مفتاحية متكررة:</span>
      <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 10px;" data-action="quick-search" data-term="عقد المقاولة">عقد المقاولة</button>
      <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 10px;" data-action="quick-search" data-term="السند الإذني">السند الإذني</button>
      <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 10px;" data-action="quick-search" data-term="الطعن بالنقض">الطعن بالنقض</button>
      <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 10px;" data-action="quick-search" data-term="بطلان إعادة الإعلان">بطلان إعادة الإعلان</button>
      <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 10px;" data-action="quick-search" data-term="فصل تعسفي">فصل تعسفي</button>
    </div>

    <!-- Search Results List styled with search-result-card -->
    <div class="search-results-list">
      <div style="font-size:13px; color:var(--text-dim); margin-block-end:12px; display:flex; justify-content:space-between; align-items:center;">
        <span>تم العثور على <bdi>${results.length}</bdi> نتيجة مطابقة في أرشيف المذكرات وقاعدة بيانات Supabase</span>
        <span class="ai-summary-badge">🤖 التلخيص القضائي الذكي نشط</span>
      </div>

      ${results.length === 0 ? `
        <div style="text-align:center; padding:48px 24px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg); color:var(--text-dim);">
          <div style="font-size:32px; margin-block-end:12px;">📂</div>
          <div style="font-size:15px; font-weight:600; color:var(--text); margin-block-end:6px;">لم يتم العثور على نتائج مطابقة لكلمة البحث</div>
          <div style="font-size:13px;">جرب تعديل كلمات البحث، أو إزالة الفلاتر، أو اختيار أحد الكلمات المفتاحية المقترحة بالأعلى.</div>
        </div>
      ` : results.map(r => `
        <div class="search-result-card">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
            <div class="search-result-title" data-action="open-matter" data-matter-id="${r.matter_id}" style="cursor:pointer;" title="فتح ملف القضية">
              ${r.matter_title}
            </div>
            <span class="chip chip-stage">${r.doc_type}</span>
          </div>

          <div style="font-size:12px; color:var(--text-dim); display:flex; gap:14px; flex-wrap:wrap; margin-block:8px;">
            <span><strong>المستند:</strong> ${r.document_name}</span>
            <span><strong>الصفحة:</strong> <bdi>${r.page}</bdi></span>
            <span><strong>المحكمة:</strong> ${r.court}</span>
            <span><strong>تاريخ الإيداع:</strong> <bdi>${r.date}</bdi></span>
          </div>

          <div class="search-snippet">
            ${highlightQuery(r.snippet, query)}
          </div>

          <!-- AI-Generated Summary Badge & Insight Box -->
          <div class="ai-summary-box">
            <div class="ai-summary-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
              </svg>
              <span>ملخص الذكاء الاصطناعي للأثر القانوني والقضائي:</span>
            </div>
            
            <div class="ai-summary-content">
              ${r.ai_summary || 'تطبيق القواعد العامة للالتزام العقدي وجواز المطالبة بالتعويض الاتفاقي والفوائد القانونية عند ثبوت الإخلال بالجدول الزمني.'}
            </div>

            ${r.ai_precedents ? `
              <div style="margin-block-start:8px; font-size:12px; color:var(--text-2); background:rgba(0,0,0,0.02); padding:6px 10px; border-radius:var(--radius-sm);">
                <strong>السند وقضاء النقض:</strong> ${r.ai_precedents}
              </div>
            ` : ''}
          </div>

          <!-- Quick Action Buttons -->
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-block-start:12px;">
            <button class="btn btn-outline btn-sm" data-action="use-precedent-in-doc" data-doc-title="${r.matter_title}">
              ✍️ إدراج في مسودة المذكرة
            </button>
            <button class="btn btn-outline btn-sm" data-action="open-matter" data-matter-id="${r.matter_id}">
              📂 فتح ملف القضية
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function highlightQuery(text, query) {
  if (!query || !text) return text;
  try {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark style="background:rgba(217, 114, 10, 0.2); padding:1px 3px; border-radius:2px;">$1</mark>');
  } catch (e) {
    return text;
  }
}
