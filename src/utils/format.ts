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
export const formatTime = (
  date: Date | string | number,
  base: Date = new Date()
): string => {
  const then = typeof date === 'number' ? new Date(date) : new Date(date)
  const diffMs = base.getTime() - then.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 0) return 'vừa xong'
  if (diffSec < 60) return 'vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} tiếng trước`
  if (diffDay < 7) return `${diffDay} ngày trước`
  if (diffWeek < 4) return `${diffWeek} tuần trước`
  if (diffMonth < 12) return `${diffMonth} tháng trước`
  return `${diffYear} năm trước`
}
