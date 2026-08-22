/**
 * Notification System for Urgent Hearings and Procedural Deadlines (< 3 days)
 */

export function getUrgentAlerts() {
  const today = new Date('2026-08-22');
  
  // Hearings within <= 3 days (2026-08-22 to 2026-08-25)
  const urgentHearings = (window.MOCK?.hearings || []).filter(h => {
    const hDate = new Date(h.hearing_date);
    const diffDays = Math.ceil((hDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  }).map(h => {
    const m = (window.MOCK?.matters || []).find(item => item.id === h.matter_id) || {};
    const hDate = new Date(h.hearing_date);
    const diffDays = Math.ceil((hDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: h.id,
      type: 'hearing',
      matter_id: h.matter_id,
      title: `جلسة نظر دعوى: ${m.case_number || 'دعوى'}`,
      subtitle: `${h.court} (${h.circuit}) — ${h.hearing_time}`,
      reason: h.adjournment_reason,
      date: h.hearing_date,
      diffDays,
      isUrgent: diffDays <= 1,
      tag: diffDays === 0 ? 'اليوم' : `خلال ${diffDays} يوم`
    };
  });

  // Deadlines overdue (< 0 days) or due in <= 3 days
  const urgentDeadlines = (window.MOCK?.deadlines || []).filter(d => {
    const dDate = new Date(d.due_date);
    const diffDays = Math.ceil((dDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }).map(d => {
    const m = (window.MOCK?.matters || []).find(item => item.id === d.matter_id) || {};
    const dDate = new Date(d.due_date);
    const diffDays = Math.ceil((dDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = diffDays < 0;
    return {
      id: d.id,
      type: 'deadline',
      matter_id: d.matter_id,
      title: d.title,
      subtitle: `${m.case_number || ''} — ${d.rule_citation}`,
      date: d.due_date,
      diffDays,
      status: d.status,
      isOverdue,
      isUrgent: isOverdue || diffDays <= 1,
      tag: isOverdue ? `متأخر ${Math.abs(diffDays)} يوم` : (diffDays === 0 ? 'اليوم' : `متبقي ${diffDays} يوم`)
    };
  });

  const allAlerts = [...urgentHearings, ...urgentDeadlines].sort((a, b) => a.diffDays - b.diffDays);
  return {
    hearings: urgentHearings,
    deadlines: urgentDeadlines,
    all: allAlerts,
    totalCount: allAlerts.length
  };
}

export function renderNotificationDropdown(state) {
  const alerts = getUrgentAlerts();

  return `
    <div class="notif-dropdown" id="notif-dropdown-box" onclick="event.stopPropagation();">
      <div class="notif-header">
        <div class="notif-header-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          التنبيهات العاجلة (أقل من ٣ أيام)
        </div>
        <span class="chip ${alerts.totalCount > 0 ? 'chip-overdue-days' : 'chip-confirmed'}">
          <bdi>${alerts.totalCount}</bdi> تنبيهات حرجة
        </span>
      </div>

      <div class="notif-list">
        ${alerts.all.length === 0 ? `
          <div style="padding:24px; text-align:center; color:var(--text-dim); font-size:13px;">
            لا توجد جلسات أو مواعيد عاجلة خلال الـ ٣ أيام القادمة.
          </div>
        ` : alerts.all.map(item => `
          <div class="notif-item ${item.isUrgent ? 'urgent' : ''}" data-action="${item.type === 'hearing' ? 'nav-screen' : 'open-matter'}" ${item.type === 'hearing' ? 'data-screen="roll"' : `data-matter-id="${item.matter_id}"`}>
            <div class="notif-item-icon ${item.isUrgent ? 'danger' : 'warn'}">
              ${item.type === 'hearing' ? `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ` : `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
              `}
            </div>
            <div style="flex:1;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                <span class="notif-item-title">${item.title}</span>
                <span class="chip ${item.isOverdue ? 'chip-overdue-days' : (item.isUrgent ? 'chip-provisional' : 'chip-stage')}" style="font-size:10px;">
                  ${item.tag}
                </span>
              </div>
              <div class="notif-item-meta">${item.subtitle}</div>
              ${item.reason ? `<div style="font-size:11px; color:var(--text); margin-block-start:2px;">القرار: ${item.reason}</div>` : ''}
              ${item.status === 'provisional' ? `
                <div style="margin-block-start:6px;">
                  <button class="btn btn-good btn-sm" style="font-size:11px; padding:2px 8px;" data-action="confirm-deadline" data-deadline-id="${item.id}" onclick="event.stopPropagation();">
                    تأكيد الميعاد الآن
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="padding:10px 16px; background:var(--inset); border-block-start:1px solid var(--border); display:flex; justify-content:space-between;">
        <button class="btn btn-outline btn-sm" data-action="nav-screen" data-screen="roll" style="font-size:12px;">
          رول الجلسات
        </button>
        <button class="btn btn-outline btn-sm" data-action="nav-screen" data-screen="deadlines" style="font-size:12px;">
          كافة المواعيد
        </button>
      </div>
    </div>
  `;
}
