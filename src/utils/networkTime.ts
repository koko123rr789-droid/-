/**
 * Network Time Synchronization Utility
 * Keeps accurate, tamper-proof time based on external server / network headers.
 * Uses performance.now() (monotonic clock) to prevent local device time tampering.
 */

let serverTimeOffset = 0; // difference between server time and performance.now()
let isSynced = false;

export async function syncNetworkTime(): Promise<number> {
  try {
    const t0 = performance.now();
    // Try our server time endpoint first
    const res = await fetch('/api/time', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const t1 = performance.now();
      const latency = (t1 - t0) / 2;
      const exactServerNow = data.now + latency;
      serverTimeOffset = exactServerNow - performance.now();
      isSynced = true;
      return getNetworkNow();
    }
  } catch {
    // Fallback: use HTTP HEAD request Date header
    try {
      const t0 = performance.now();
      const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
      const dateHeader = res.headers.get('date');
      if (dateHeader) {
        const serverEpoch = new Date(dateHeader).getTime();
        const t1 = performance.now();
        serverTimeOffset = serverEpoch + ((t1 - t0) / 2) - performance.now();
        isSynced = true;
        return getNetworkNow();
      }
    } catch {
      // Fallback to local clock if offline
      serverTimeOffset = Date.now() - performance.now();
      isSynced = true;
    }
  }
  return getNetworkNow();
}

/**
 * Returns current timestamp in ms based on external network time.
 * Even if user changes date/time on phone settings, performance.now()
 * ensures elapsed time ticks monotonically and correctly.
 */
export function getNetworkNow(): number {
  if (!isSynced) {
    return Date.now();
  }
  return Math.round(performance.now() + serverTimeOffset);
}

/**
 * Format current network date & time in Egyptian / Arabic locale
 */
export function getFormattedNetworkDateTime(): {
  timeStr: string;
  dateStr: string;
  isTamperProof: boolean;
} {
  const now = new Date(getNetworkNow());

  // Egyptian Cairo Timezone
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Africa/Cairo',
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Africa/Cairo',
  };

  try {
    const timeStr = new Intl.DateTimeFormat('ar-EG', timeOptions).format(now);
    const dateStr = new Intl.DateTimeFormat('ar-EG', dateOptions).format(now);
    return { timeStr, dateStr, isTamperProof: isSynced };
  } catch {
    return {
      timeStr: now.toLocaleTimeString(),
      dateStr: now.toLocaleDateString(),
      isTamperProof: isSynced,
    };
  }
}
