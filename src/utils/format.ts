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

export const formatPresence = (date: Date | string | number | undefined | null): string => {
  if (!date) return "Ngoại tuyến";

  const then = typeof date === 'number' ? new Date(date) : new Date(date);
  const now = new Date();

  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);

  // Các mốc thời gian gần
  if (diffMin < 1) return "Vừa mới hoạt động";
  if (diffMin < 60) return `Hoạt động ${diffMin} phút trước`;

  const timeStr = then.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const isSameDay = then.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = then.toDateString() === yesterday.toDateString();

  if (isSameDay) return `Hoạt động lúc ${timeStr}`;
  if (isYesterday) return `Hoạt động hôm qua lúc ${timeStr}`;

  // Trên 2 ngày
  const dateStr = then.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit'
  });

  return `Hoạt động ngày ${dateStr} lúc ${timeStr}`;
}
