import i18next from "i18next"
import "@/lib/i18n"

export const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

/**
 * Format a date as relative time (e.g. "1 tiếng trước", "3 ngày trước").
 * @param date - Date, ISO string, or timestamp (ms)
 * @param base - Optional "now" reference (default: new Date())
 */
// export const formatTime = (
//   date: Date | string | number,
//   base: Date = new Date()
// ): string => {
//   const then = typeof date === 'number' ? new Date(date) : new Date(date)
//   const diffMs = base.getTime() - then.getTime()
//   const diffSec = Math.floor(diffMs / 1000)
//   const diffMin = Math.floor(diffSec / 60)
//   const diffHour = Math.floor(diffMin / 60)
//   const diffDay = Math.floor(diffHour / 24)
//   const diffWeek = Math.floor(diffDay / 7)
//   const diffMonth = Math.floor(diffDay / 30)
//   const diffYear = Math.floor(diffDay / 365)

//   if (diffSec < 0) return i18next.t('time.just_now')
//   if (diffSec < 60) return i18next.t('time.just_now')
//   if (diffMin < 60) return i18next.t('time.m_ago', { n: diffMin })
//   if (diffHour < 24) return i18next.t('time.h_ago', { n: diffHour })
//   if (diffDay < 7) return i18next.t('time.d_ago', { n: diffDay })
//   if (diffWeek < 4) return i18next.t('time.w_ago', { n: diffWeek })
//   if (diffMonth < 12) return i18next.t('time.mo_ago', { n: diffMonth })
//   return i18next.t('time.y_ago', { n: diffYear })
// }

export const formatTime = (
  date: Date | string | number,
  base: Date = new Date()
): string => {
  const then = new Date(date)

  const diffMs = base.getTime() - then.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)

  const diffMonth =
    (base.getFullYear() - then.getFullYear()) * 12 +
    (base.getMonth() - then.getMonth())

  const diffYear = base.getFullYear() - then.getFullYear()

  if (diffSec < 60) return i18next.t('time.just_now')
  if (diffMin < 60) return i18next.t('time.m_ago', { n: diffMin })
  if (diffHour < 24) return i18next.t('time.h_ago', { n: diffHour })
  if (diffDay < 7) return i18next.t('time.d_ago', { n: diffDay })
  if (diffWeek < 4) return i18next.t('time.w_ago', { n: diffWeek })
  if (diffMonth < 12) return i18next.t('time.mo_ago', { n: diffMonth || 1 })

  return i18next.t('time.y_ago', { n: diffYear })
}

export const formatPresence = (date: Date | string | number | undefined | null): string => {
  if (!date) return i18next.t('time.offline');

  const then = typeof date === 'number' ? new Date(date) : new Date(date);
  const now = new Date();

  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  // Recent timeframes
  if (diffMin < 1) return i18next.t('time.active_now');
  if (diffMin < 60) return i18next.t('time.m_ago', { n: diffMin });

  const timeStr = then.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const isSameDay = then.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = then.toDateString() === yesterday.toDateString();

  if (isSameDay) return i18next.t('time.active_at', { time: timeStr });
  if (isYesterday) return i18next.t('time.active_yesterday', { time: timeStr });

  // More than 2 days
  const dateStr = then.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit'
  });

  return i18next.t('time.active_on', { date: dateStr, time: timeStr });
}

