/**
 * DashboardStats Component
 * Pulls case data from Supabase to populate the 5 statistical tiles defined in styles.css:
 * 1. جلسات اليوم (Today's Hearings)
 * 2. جلسات هذا الأسبوع (This Week's Hearings)
 * 3. مواعيد متأخرة / حتمية (Overdue & Critical Deadlines)
 * 4. مستندات بانتظار المراجعة (Pending Document Extractions)
 * 5. قوالب الصياغة المعتمدة (Approved Legal Templates)
 */
import { supabaseService } from '../services/supabaseService.js';

export async function renderDashboardStats() {
  const stats = await supabaseService.getDashboardStats();

  return `
    <!-- Five Statistical Tiles from Supabase Data -->
    <div class="stat-grid" id="dashboard-stats-container">
      <!-- Tile 1: Today's Hearings -->
      <div class="stat-tile" data-action="nav-screen" data-screen="roll" style="cursor:pointer;" title="استعراض رول اليوم">
        <div class="stat-label">
          <span>جلسات اليوم</span>
          <span style="font-size:16px;">⚖️</span>
        </div>
        <div class="stat-number"><bdi>${stats.todayHearingsCount}</bdi></div>
        <div class="stat-sub">في <bdi>${stats.todayHearingsCourtsCount}</bdi> محاكم مختلفة</div>
      </div>

      <!-- Tile 2: Weekly Hearings -->
      <div class="stat-tile" data-action="nav-screen" data-screen="roll" style="cursor:pointer;" title="استعراض رول الأسبوع">
        <div class="stat-label">
          <span>جلسات هذا الأسبوع</span>
          <span style="font-size:16px;">📅</span>
        </div>
        <div class="stat-number"><bdi>${stats.weekHearingsCount}</bdi></div>
        <div class="stat-sub">من ٢٢ إلى ٢٨ أغسطس</div>
      </div>

      <!-- Tile 3: Overdue / Urgent Deadlines -->
      <div class="stat-tile ${stats.overdueDeadlinesCount > 0 ? 'alert-tile' : ''}" data-action="nav-screen" data-screen="deadlines" style="cursor:pointer;" title="استعراض المواعيد الحتمية">
        <div class="stat-label">
          <span>مواعيد متأخرة</span>
          <span style="font-size:16px;">🚨</span>
        </div>
        <div class="stat-number"><bdi>${stats.overdueDeadlinesCount}</bdi></div>
        <div class="stat-sub">${stats.overdueDeadlinesCount > 0 ? 'تتطلب اتخاذ إجراء فوري' : 'جميع المواعيد منتظمة'}</div>
      </div>

      <!-- Tile 4: Pending Document Extractions -->
      <div class="stat-tile" data-action="nav-screen" data-screen="review" style="cursor:pointer;" title="شاشة التحقق والمراجعة">
        <div class="stat-label">
          <span>مستندات بانتظار المراجعة</span>
          <span style="font-size:16px;">🔍</span>
        </div>
        <div class="stat-number"><bdi>${stats.pendingReviewDocsCount}</bdi></div>
        <div class="stat-sub">مستخرجة آلياً عبر الذكاء الاصطناعي</div>
      </div>

      <!-- Tile 5: Approved Legal Templates -->
      <div class="stat-tile" data-action="nav-screen" data-screen="generator" style="cursor:pointer;" title="محرك توليد الوثائق">
        <div class="stat-label">
          <span>قوالب الصياغة المعتمدة</span>
          <span style="font-size:16px;">📝</span>
        </div>
        <div class="stat-number"><bdi>${stats.approvedTemplatesCount}</bdi></div>
        <div class="stat-sub">جاهزة للتوليد والدمج الفوري</div>
      </div>
    </div>
  `;
}
