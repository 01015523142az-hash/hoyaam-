/**
 * Archive Search & AI Legal Precedent Summarization Module
 */

export function renderArchiveSearchScreen(state) {
  const query = (state.archiveSearchQuery || '').toLowerCase().trim();
  const corpus = window.MOCK?.archive_corpus || [];
  
  const results = corpus.filter(item => {
    if (!query) return true;
    return item.snippet.toLowerCase().includes(query) ||
           item.document_name.toLowerCase().includes(query) ||
           item.matter_title.toLowerCase().includes(query) ||
           (item.ai_summary && item.ai_summary.toLowerCase().includes(query)) ||
           (item.ai_precedents && item.ai_precedents.toLowerCase().includes(query));
  });

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">البحث في أرشيف المذكرات والسوابق القضائية</h1>
        <div class="page-subtitle">محرك بحث دلالي مع تلخيص فوري للمبادئ القانونية بالذكاء الاصطناعي</div>
      </div>
      <button class="btn btn-outline btn-sm" data-action="nav-screen" data-screen="generator">
        ✨ توليد وثيقة استناداً للسوابق
      </button>
    </div>

    <div class="search-hero-box">
      <div class="search-input-wrapper">
        <span class="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </span>
        <input type="text" style="height:46px; font-size:15px;" placeholder="ابحث عن نص قانوني، صيغة عقد، دفع شكلي، أو سابقة قضائية..." data-action="archive-search" value="${state.archiveSearchQuery || ''}">
      </div>

      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <select class="filter-select" id="arch-type-filter">
          <option value="all">كل أنواع المستندات</option>
          <option value="عقود">عقود واتفاقيات</option>
          <option value="مذكرات">مذكرات دفاع</option>
          <option value="صحف">صحف طعون</option>
          <option value="أحكام">أحكام قضائية</option>
        </select>

        <select class="filter-select" id="arch-court-filter">
          <option value="all">كل المحاكم</option>
          <option value="استئناف">محكمة الاستئناف</option>
          <option value="نقض">محكمة النقض</option>
          <option value="مجلس الدولة">مجلس الدولة</option>
        </select>

        <button class="btn btn-primary" data-action="search-archive-trigger">
          بحث فوري في الأرشيف
        </button>
      </div>
    </div>

    <!-- Quick Filter Tags -->
    <div style="display:flex; gap:8px; margin-block:14px; flex-wrap:wrap; align-items:center;">
      <span style="font-size:12px; color:var(--text-dim);">كلمات مفتاحية شائعة:</span>
      <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 10px;" data-action="quick-search" data-term="عقد المقاولة">عقد المقاولة</button>
      <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 10px;" data-action="quick-search" data-term="السند الإذني">السند الإذني</button>
      <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 10px;" data-action="quick-search" data-term="الطعن بالنقض">الطعن بالنقض</button>
      <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 10px;" data-action="quick-search" data-term="بطلان إعادة الإعلان">بطلان إعادة الإعلان</button>
    </div>

    <div class="search-results-list">
      <div style="font-size:13px; color:var(--text-dim); margin-block-end:10px; display:flex; justify-content:space-between; align-items:center;">
        <span>تم العثور على <bdi>${results.length}</bdi> سابقة ومستند مطابق في الأرشيف</span>
        <span class="ai-summary-badge">🤖 التلخيص القضائي بالذكاء الاصطناعي مفعل</span>
      </div>

      ${results.length === 0 ? `
        <div style="text-align:center; padding:40px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg); color:var(--text-dim);">
          لم يتم العثور على نتائج مطابقة لكلمة البحث. جرب كلمات مفتاحية أخرى.
        </div>
      ` : results.map(r => `
        <div class="search-result-card">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div class="search-result-title" data-action="open-matter" data-matter-id="${r.matter_id}">
              ${r.matter_title}
            </div>
            <span class="chip chip-stage">${r.doc_type}</span>
          </div>

          <div style="font-size:12px; color:var(--text-dim); display:flex; gap:14px; flex-wrap:wrap; margin-block:6px;">
            <span><strong>المستند:</strong> ${r.document_name}</span>
            <span><strong>الصفحة:</strong> <bdi>${r.page}</bdi></span>
            <span><strong>المحكمة:</strong> ${r.court}</span>
            <span><strong>تاريخ الإيداع:</strong> <bdi>${r.date}</bdi></span>
          </div>

          <div class="search-snippet">
            ${r.snippet}
          </div>

          <!-- AI Summarized Insight Box -->
          <div class="ai-summary-box">
            <div class="ai-summary-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
              ملخص الذكاء الاصطناعي للأثر القانوني:
            </div>
            <div class="ai-summary-content">
              ${r.ai_summary || 'تطبيق القواعد العامة للالتزام العقدي وجواز المطالبة بالتعويض الاتفاقي والفوائد القانونية عند ثبوت الإخلال بالجدول الزمني.'}
            </div>
            ${r.ai_precedents ? `
              <div style="margin-block-start:6px; font-size:12px; color:var(--text-2);">
                <strong>السند وقضاء النقض:</strong> ${r.ai_precedents}
              </div>
            ` : ''}
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; margin-block-start:10px;">
            <button class="btn btn-outline btn-sm" data-action="use-precedent-in-doc" data-doc-title="${r.matter_title}">
              إدراج في مسودة المذكرة
            </button>
            <button class="btn btn-outline btn-sm" data-action="open-matter" data-matter-id="${r.matter_id}">
              فتح ملف القضية
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
