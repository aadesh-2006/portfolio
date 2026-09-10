// Client service for fetching live normalized LeetCode metrics with caching & deterministic fallback
export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  profileRanking: number;
  contestRating: number;
  peakRating: number;
  contestsAttended: number;
  contestGlobalRanking: number;
  contestTopPercentage: number;
  streak: number;
  totalActiveDays: number;
  submissionCalendar: Record<string, number>;
  isLive: boolean;
  fetchedAt: string;
}

export const LEETCODE_FALLBACK: LeetCodeStats = {
  username: 'Aadesh_2006',
  totalSolved: 372,
  easySolved: 224,
  mediumSolved: 136,
  hardSolved: 12,
  totalSubmissions: 854,
  profileRanking: 359829,
  contestRating: 1716,
  peakRating: 1759,
  contestsAttended: 18,
  contestGlobalRanking: 110727,
  contestTopPercentage: 12.8,
  streak: 44,
  totalActiveDays: 157,
  submissionCalendar: {},
  isLive: false,
  fetchedAt: new Date().toISOString()
};

const CACHE_KEY = 'aadesh_leetcode_stats_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour client cache

export async function getLeetCodeMetrics(): Promise<LeetCodeStats> {
  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const age = Date.now() - new Date(parsed.fetchedAt).getTime();
      if (age < CACHE_TTL_MS && parsed.isLive) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  try {
    const response = await fetch('/api/leetcode', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data: LeetCodeStats = await response.json();
      if (data && typeof data.totalSolved === 'number') {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {
          // ignore cache write error
        }
        return data;
      }
    }
  } catch {
    // If endpoint fails or is unreachable, fallback cleanly
  }

  return LEETCODE_FALLBACK;
}
