// Isolated Local Simulation Sync for MenteeLog_Simulation
// Synchronizes notifications and statuses locally across the 3 simulated portals
// without modifying or overwriting the main production folder or live Supabase tables.
export async function syncRemote(_supabase, db) {
  try {
    if (!db) return false;

    const stu = (db.users || []).find(u => u.role === 'Student' && (String(u.email || '').toLowerCase() === 'kenzosomes@gmail.com' || String(u.name || '').toLowerCase().includes('kenzo') || u.id === 's1'));
    const sup = (db.users || []).find(u => u.role === 'Supervisor' && (String(u.email || '').toLowerCase().includes('shisulzhin') || String(u.email || '').toLowerCase().includes('shisuizhin') || String(u.name || '').toLowerCase().includes('shisui') || u.id === 'v1'));

    const primaryStudent = stu;
    const primarySupervisor = sup;

    db.notifications = db.notifications || [];
    const ensureNotif = (notifObj) => {
      try {
        if (localStorage.getItem('menteelog.sim.notif_cleared.' + notifObj.id) === '1') {
          db.notifications = db.notifications.filter(n => n.id !== notifObj.id);
          return;
        }
      } catch (e) {}
      let isRead = false;
      try { isRead = localStorage.getItem('menteelog.sim.notif_read.' + notifObj.id) === '1'; } catch (e) {}
      const existing = db.notifications.find(n => n.id === notifObj.id);
      if (existing) {
        existing.title = notifObj.title;
        existing.message = notifObj.message;
        existing.targetLogId = notifObj.targetLogId;
        existing.targetPage = notifObj.targetPage;
        existing.role = notifObj.role;
        if (isRead) existing.read = true;
      } else {
        db.notifications.unshift({ ...notifObj, read: isRead });
      }
    };

    for (const l of (db.logs || [])) {
      if (l.coordinatorRemarks) {
        ensureNotif({
          id: 'notif-coord-review-' + l.id,
          userId: primarySupervisor?.id || 'v1',
          role: 'Supervisor',
          type: 'DTR_Event',
          title: 'DTR compliance review forwarded',
          message: `Coordinator directive on kenzosomes (${l.date}): "${l.coordinatorRemarks}" — Click to review & sign off.`,
          date: new Date().toISOString(),
          targetPage: 'dtr',
          targetLogId: l.id
        });
      }
      if (['Flagged', 'Pending'].includes(l.status)) {
        ensureNotif({
          id: 'notif-flagged-sup-' + l.id,
          userId: primarySupervisor?.id || 'v1',
          role: 'Supervisor',
          type: 'DTR_Event',
          title: 'Flagged off-site shift requires review',
          message: `kenzosomes logged an off-site shift on ${l.date} (${l.hours}h). Click to inspect map pin and exception.`,
          date: l.clockOut || new Date().toISOString(),
          targetPage: 'dtr',
          targetLogId: l.id
        });
        ensureNotif({
          id: 'notif-flagged-coord-' + l.id,
          userId: 'c1',
          role: 'Coordinator',
          type: 'DTR_Event',
          title: 'Off-site DTR anomaly detected',
          message: `kenzosomes clocked outside the 100m geofence on ${l.date}. Click to open Compliance Review.`,
          date: l.clockOut || new Date().toISOString(),
          targetPage: 'dtr',
          targetLogId: l.id
        });
      }
    }

    for (const a of (db.appraisals || [])) {
      ensureNotif({
        id: 'notif-appraisal-' + a.id,
        userId: primaryStudent?.id || 's1',
        role: 'Student',
        type: 'System',
        title: 'Performance appraisal finalized',
        message: `Your supervisor submitted your final evaluation (${Number(a.score || 5).toFixed(1)} / 5.0). Click to view rubric & signature.`,
        date: a.date || new Date().toISOString(),
        targetPage: 'appraisals'
      });
    }

    return false;
  } catch (err) {
    console.warn('Simulation sync note:', err);
    return false;
  }
}
