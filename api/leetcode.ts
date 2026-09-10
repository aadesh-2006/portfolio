// Vercel Serverless Function: /api/leetcode
// Dynamically fetches and normalizes public LeetCode statistics and submission calendar for Aadesh_2006

export interface LeetCodeDataResponse {
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

const FALLBACK_DATA: LeetCodeDataResponse = {
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

const LEETCODE_GRAPHQL_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      profile {
        ranking
        reputation
      }
      submissionCalendar
      userCalendar {
        streak
        totalActiveDays
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
    }
  }
`;

export async function fetchLeetCodeProfile(username: string = 'Aadesh_2006'): Promise<LeetCodeDataResponse> {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://leetcode.com/'
      },
      body: JSON.stringify({
        query: LEETCODE_GRAPHQL_QUERY,
        variables: { username }
      }),
      signal: AbortSignal.timeout(6000)
    });

    if (!response.ok) {
      return { ...FALLBACK_DATA, isLive: false, fetchedAt: new Date().toISOString() };
    }

    const json = (await response.json()) as Record<string, any>;
    const data = json?.data;
    const matchedUser = data?.matchedUser;

    if (!matchedUser) {
      return { ...FALLBACK_DATA, isLive: false, fetchedAt: new Date().toISOString() };
    }

    const acSubmissions = matchedUser.submitStats?.acSubmissionNum || [];
    const allStat = acSubmissions.find((s: { difficulty: string }) => s.difficulty === 'All');
    const easyStat = acSubmissions.find((s: { difficulty: string }) => s.difficulty === 'Easy');
    const mediumStat = acSubmissions.find((s: { difficulty: string }) => s.difficulty === 'Medium');
    const hardStat = acSubmissions.find((s: { difficulty: string }) => s.difficulty === 'Hard');

    let calendar: Record<string, number> = {};
    if (matchedUser.submissionCalendar) {
      try {
        calendar = JSON.parse(matchedUser.submissionCalendar);
      } catch {
        calendar = {};
      }
    }

    const contestRanking = data?.userContestRanking;
    const contestHistory = data?.userContestRankingHistory || [];
    
    let peakRating = contestRanking?.rating ? Math.round(contestRanking.rating) : 1759;
    if (Array.isArray(contestHistory) && contestHistory.length > 0) {
      const maxContest = contestHistory.reduce((max: number, item: { attended?: boolean; rating?: number }) => {
        if (item.attended && typeof item.rating === 'number') {
          return Math.max(max, Math.round(item.rating));
        }
        return max;
      }, peakRating);
      peakRating = Math.max(peakRating, maxContest);
    }

    return {
      username: matchedUser.username || username,
      totalSolved: allStat?.count ?? FALLBACK_DATA.totalSolved,
      easySolved: easyStat?.count ?? FALLBACK_DATA.easySolved,
      mediumSolved: mediumStat?.count ?? FALLBACK_DATA.mediumSolved,
      hardSolved: hardStat?.count ?? FALLBACK_DATA.hardSolved,
      totalSubmissions: allStat?.submissions ?? FALLBACK_DATA.totalSubmissions,
      profileRanking: matchedUser.profile?.ranking ?? FALLBACK_DATA.profileRanking,
      contestRating: contestRanking?.rating ? Math.round(contestRanking.rating) : FALLBACK_DATA.contestRating,
      peakRating: peakRating || FALLBACK_DATA.peakRating,
      contestsAttended: contestRanking?.attendedContestsCount ?? FALLBACK_DATA.contestsAttended,
      contestGlobalRanking: contestRanking?.globalRanking ?? FALLBACK_DATA.contestGlobalRanking,
      contestTopPercentage: contestRanking?.topPercentage ?? FALLBACK_DATA.contestTopPercentage,
      streak: matchedUser.userCalendar?.streak ?? FALLBACK_DATA.streak,
      totalActiveDays: matchedUser.userCalendar?.totalActiveDays ?? FALLBACK_DATA.totalActiveDays,
      submissionCalendar: calendar,
      isLive: true,
      fetchedAt: new Date().toISOString()
    };
  } catch {
    return { ...FALLBACK_DATA, isLive: false, fetchedAt: new Date().toISOString() };
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const username = (req.query?.username as string) || 'Aadesh_2006';
  const data = await fetchLeetCodeProfile(username);

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).json(data);
}
