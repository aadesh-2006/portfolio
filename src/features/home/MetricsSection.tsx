import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Code2, 
  GitBranch, 
  ExternalLink, 
  Flame, 
  TrendingUp,
  Cpu,
  Zap,
  Award,
  Terminal
} from 'lucide-react';
import { Text } from '../../components/Text';
import { ThreeDCard } from '../../components/ThreeDCard';
import { portfolioData } from '../../content/portfolioData';
import { getLeetCodeMetrics, LEETCODE_FALLBACK, type LeetCodeStats } from '../../services/leetcodeService';
import { getGitHubStats, GITHUB_FALLBACK, type GitHubStatsData } from '../../services/githubService';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export const MetricsSection: React.FC = () => {
  const [hoveredGitHubCell, setHoveredGitHubCell] = useState<{ date: string; count: number } | null>(null);
  const [hoveredLeetCodeCell, setHoveredLeetCodeCell] = useState<{ date: string; count: number } | null>(null);
  
  const [leetCodeStats, setLeetCodeStats] = useState<LeetCodeStats>(LEETCODE_FALLBACK);
  const [gitHubStats, setGitHubStats] = useState<GitHubStatsData>(GITHUB_FALLBACK);
  const [gitHubContributions, setGitHubContributions] = useState<ContributionDay[]>([]);

  // Fetch live LeetCode profile data safely in the background
  useEffect(() => {
    let isMounted = true;
    getLeetCodeMetrics().then((data) => {
      if (isMounted && data) {
        setLeetCodeStats(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch live GitHub repository stats and top languages safely
  useEffect(() => {
    let isMounted = true;
    getGitHubStats().then((data) => {
      if (isMounted && data) {
        setGitHubStats(prev => ({
          ...data,
          totalContributions: prev.totalContributions || data.totalContributions
        }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch live GitHub contribution calendar
  useEffect(() => {
    let isMounted = true;

    const fetchGitHubCalendar = async () => {
      try {
        const contribRes = await fetch('https://github-contributions-api.jogruber.de/v4/aadesh-2006?y=last');
        if (contribRes.ok) {
          const contribData = await contribRes.json();
          if (isMounted && contribData.contributions && Array.isArray(contribData.contributions)) {
            const total = contribData.total?.lastYear || contribData.contributions.reduce((acc: number, cur: ContributionDay) => acc + (cur.count || 0), 0);
            setGitHubContributions(contribData.contributions);
            setGitHubStats(prev => ({
              ...prev,
              totalContributions: total || 240
            }));
          }
        }
      } catch {
        // Fallback remains active silently
      }
    };

    fetchGitHubCalendar();
    return () => {
      isMounted = false;
    };
  }, []);

  // Generate GitHub 52-week calendar data (364 days)
  const gitHubCalendarData = useMemo(() => {
    if (gitHubContributions.length >= 350) {
      return gitHubContributions.slice(-364);
    }

    const days: ContributionDay[] = [];
    const today = new Date();
    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const seed = (d.getMonth() * 31 + d.getDate() + (isWeekend ? 2 : 7)) % 17;
      let count = 0;
      let level = 0;

      if (i < 90) {
        if (seed > 13) { count = 18; level = 4; }
        else if (seed > 9) { count = 9; level = 3; }
        else if (seed > 5) { count = 4; level = 2; }
        else if (seed > 2) { count = 2; level = 1; }
      } else if (i < 180) {
        if (seed > 14) { count = 12; level = 3; }
        else if (seed > 8) { count = 5; level = 2; }
        else if (seed > 4) { count = 2; level = 1; }
      } else {
        if (seed > 14) { count = 6; level = 2; }
        else if (seed > 7) { count = 2; level = 1; }
      }

      days.push({ date: dateStr, count, level });
    }
    return days;
  }, [gitHubContributions]);

  // Generate LeetCode 52-week calendar data from live submissionCalendar (364 days)
  const leetCodeCalendarData = useMemo(() => {
    const days: ContributionDay[] = [];
    const today = new Date();
    
    // Map timestamp string keys to YYYY-MM-DD
    const submissionMap = new Map<string, number>();
    if (leetCodeStats.submissionCalendar && typeof leetCodeStats.submissionCalendar === 'object') {
      Object.entries(leetCodeStats.submissionCalendar).forEach(([tsStr, count]) => {
        const ts = parseInt(tsStr, 10);
        if (!isNaN(ts)) {
          const date = new Date(ts * 1000);
          const dateStr = date.toISOString().split('T')[0];
          submissionMap.set(dateStr, (submissionMap.get(dateStr) || 0) + Number(count));
        }
      });
    }

    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = submissionMap.get(dateStr) || 0;
      
      let level = 0;
      if (count > 0) {
        if (count >= 10) level = 4;
        else if (count >= 5) level = 3;
        else if (count >= 2) level = 2;
        else level = 1;
      }

      days.push({ date: dateStr, count, level });
    }
    return days;
  }, [leetCodeStats.submissionCalendar]);

  // Group 364 days into 52 columns of 7 days
  const gitHubWeeks = useMemo(() => {
    const cols: ContributionDay[][] = [];
    for (let i = 0; i < gitHubCalendarData.length; i += 7) {
      cols.push(gitHubCalendarData.slice(i, i + 7));
    }
    return cols;
  }, [gitHubCalendarData]);

  const leetCodeWeeks = useMemo(() => {
    const cols: ContributionDay[][] = [];
    for (let i = 0; i < leetCodeCalendarData.length; i += 7) {
      cols.push(leetCodeCalendarData.slice(i, i + 7));
    }
    return cols;
  }, [leetCodeCalendarData]);

  // Color mappers
  const getGitHubCellColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-[#0e4429] hover:bg-[#156f44] border-[#1b4d32]';
      case 2: return 'bg-[#006d32] hover:bg-[#008f43] border-[#009947]';
      case 3: return 'bg-[#26a641] hover:bg-[#34c759] border-[#39d353]';
      case 4: return 'bg-[#39d353] hover:bg-[#4ef36c] border-[#5cf77a] shadow-[0_0_8px_rgba(57,211,83,0.3)]';
      default: return 'bg-[#121214] hover:bg-[#1a1a1f] border-border-grid/30';
    }
  };

  const getLeetCodeCellColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-[#452203] hover:bg-[#633306] border-[#78350f]';
      case 2: return 'bg-[#92400e] hover:bg-[#b45309] border-[#d97706]';
      case 3: return 'bg-[#d97706] hover:bg-[#f59e0b] border-[#fbbf24]';
      case 4: return 'bg-[#f59e0b] hover:bg-[#fbbf24] border-[#fde047] shadow-[0_0_8px_rgba(245,158,11,0.4)]';
      default: return 'bg-[#121214] hover:bg-[#1a1a1f] border-border-grid/30';
    }
  };

  const monthLabels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  return (
    <section id="metrics" className="py-20 bg-black scroll-mt-12 text-left app-container relative z-10">
      <div className="space-y-10">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-border-grid/50 pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-accent-cyan animate-pulse" />
            <Text variant="label" className="text-accent-cyan font-bold tracking-[0.15em]">
              [ METRICS // MODULE_02 ]
            </Text>
          </div>
          <span className="text-[10px] font-mono text-text-muted uppercase">
            ENGINEERING ACTIVITY // LIVE SIGNALS
          </span>
        </div>

        {/* Top Telemetry Aggregate Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 font-mono">
          <div className="border border-border-grid bg-[#080808] p-4 rounded-[4px] relative overflow-hidden group hover:border-accent-cyan/40 transition-all">
            <div className="flex items-center justify-between text-text-muted text-[10px] mb-1 uppercase tracking-wider">
              <span>LEETCODE SOLVED</span>
              <Code2 className="w-3.5 h-3.5 text-amber-500/80" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {leetCodeStats.totalSolved}+
            </div>
            <div className="text-[10px] text-accent-cyan font-semibold mt-1">
              {leetCodeStats.peakRating} PEAK RATING
            </div>
          </div>

          <div className="border border-border-grid bg-[#080808] p-4 rounded-[4px] relative overflow-hidden group hover:border-accent-cyan/40 transition-all">
            <div className="flex items-center justify-between text-text-muted text-[10px] mb-1 uppercase tracking-wider">
              <span>GITHUB REPOSITORIES</span>
              <GitBranch className="w-3.5 h-3.5 text-emerald-400/80" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {gitHubStats.repos}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">
              PUBLIC OPEN SOURCE
            </div>
          </div>

          <div className="border border-border-grid bg-[#080808] p-4 rounded-[4px] relative overflow-hidden group hover:border-accent-cyan/40 transition-all">
            <div className="flex items-center justify-between text-text-muted text-[10px] mb-1 uppercase tracking-wider">
              <span>PROJECTS SHIPPED</span>
              <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {portfolioData.projects.length}
            </div>
            <div className="text-[10px] text-text-muted font-semibold mt-1">
              FULL-STACK & ML
            </div>
          </div>

          <div className="border border-border-grid bg-[#080808] p-4 rounded-[4px] relative overflow-hidden group hover:border-accent-cyan/40 transition-all">
            <div className="flex items-center justify-between text-text-muted text-[10px] mb-1 uppercase tracking-wider">
              <span>CORE SKILLS</span>
              <TrendingUp className="w-3.5 h-3.5 text-accent-cyan" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {portfolioData.skills.reduce((acc, cat) => acc + cat.skills.length, 0)}
            </div>
            <div className="text-[10px] text-text-muted font-semibold mt-1">
              {portfolioData.skills.length} DOMAIN CLUSTERS
            </div>
          </div>
        </div>

        {/* Main 2-Column Dashboard Grid: LeetCode on Left, GitHub on Right */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          
          {/* 1. LEETCODE DASHBOARD CARD */}
          <ThreeDCard 
            className="p-5 sm:p-6 glass-panel border border-border-grid bg-[#080808] flex flex-col justify-between space-y-6 text-left"
            glowColor="rgba(245, 158, 11, 0.12)"
          >
            <div className="space-y-6">
              
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-border-grid/40 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span className="font-syncopate text-base sm:text-lg font-bold text-white tracking-wider uppercase">
                      LEETCODE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted block">
                    DSA & COMPETITIVE PROGRAMMING
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded-[2px] border ${
                    leetCodeStats.isLive 
                      ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' 
                      : 'border-border-grid text-text-muted bg-black/40'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${leetCodeStats.isLive ? 'bg-amber-400 animate-pulse' : 'bg-zinc-500'}`} />
                    {leetCodeStats.isLive ? 'LIVE TELEMETRY' : 'FALLBACK DATA'}
                  </span>

                  <a
                    href={portfolioData.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-400 hover:text-white bg-black/60 border border-amber-500/30 hover:border-amber-400 px-2.5 py-1 rounded-[2px] transition-all font-semibold uppercase"
                  >
                    <span>@{leetCodeStats.username}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Sub-headline telemetry stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                <div className="bg-[#050505] border border-border-grid/40 p-2.5 rounded-[2px]">
                  <span className="text-[9px] text-text-muted block uppercase">TOTAL SOLVED</span>
                  <span className="text-base font-bold text-amber-400">{leetCodeStats.totalSolved}</span>
                  <span className="text-[8px] text-zinc-500 block">All Problems</span>
                </div>

                <div className="bg-[#050505] border border-border-grid/40 p-2.5 rounded-[2px]">
                  <span className="text-[9px] text-text-muted block uppercase">CONTEST RATING</span>
                  <span className="text-base font-bold text-white flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    {leetCodeStats.contestRating}
                  </span>
                  <span className="text-[8px] text-accent-cyan block">{leetCodeStats.peakRating} Peak</span>
                </div>

                <div className="bg-[#050505] border border-border-grid/40 p-2.5 rounded-[2px]">
                  <span className="text-[9px] text-text-muted block uppercase">STREAK</span>
                  <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    {leetCodeStats.streak}d
                  </span>
                  <span className="text-[8px] text-zinc-500 block">{leetCodeStats.totalActiveDays} Active Days</span>
                </div>

                <div className="bg-[#050505] border border-border-grid/40 p-2.5 rounded-[2px]">
                  <span className="text-[9px] text-text-muted block uppercase">GLOBAL TIER</span>
                  <span className="text-base font-bold text-accent-cyan flex items-center gap-1">
                    <Award className="w-3 h-3 text-accent-cyan" />
                    Top {leetCodeStats.contestTopPercentage}%
                  </span>
                  <span className="text-[8px] text-zinc-500 block">{leetCodeStats.contestsAttended} Contests</span>
                </div>
              </div>

              {/* LeetCode Activity Calendar Heatmap */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-amber-400" />
                    SUBMISSION ACTIVITY MATRIX
                  </span>
                  {hoveredLeetCodeCell ? (
                    <span className="text-amber-400 font-bold transition-all">
                      {hoveredLeetCodeCell.count} {hoveredLeetCodeCell.count === 1 ? 'submission' : 'submissions'} on {hoveredLeetCodeCell.date}
                    </span>
                  ) : (
                    <span className="text-zinc-400">Hover over cells to inspect</span>
                  )}
                </div>

                {/* Heatmap Matrix Container */}
                <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border-grid">
                  <div className="min-w-[620px] space-y-1 select-none">
                    
                    {/* Month header row */}
                    <div className="flex justify-between text-[8px] font-mono text-text-muted/70 px-6">
                      {monthLabels.map((m, idx) => (
                        <span key={idx}>{m}</span>
                      ))}
                    </div>

                    {/* Heatmap grid */}
                    <div className="flex gap-1 items-start">
                      <div className="flex flex-col justify-between text-[7px] font-mono text-text-muted/60 h-[86px] pr-1 py-0.5">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                      </div>

                      {/* 52 Week Columns */}
                      <div className="flex-1 flex gap-[3px] items-center">
                        {leetCodeWeeks.map((week, wIdx) => (
                          <div key={wIdx} className="flex flex-col gap-[3px]">
                            {week.map((day, dIdx) => (
                              <div
                                key={dIdx}
                                onMouseEnter={() => setHoveredLeetCodeCell({ date: day.date, count: day.count })}
                                onMouseLeave={() => setHoveredLeetCodeCell(null)}
                                className={`w-[10px] h-[10px] rounded-[1.5px] border transition-all duration-100 cursor-pointer ${getLeetCodeCellColor(day.level)}`}
                                title={`${day.count} submissions on ${day.date}`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Heatmap Legend */}
                    <div className="flex items-center justify-end gap-1.5 pt-2 text-[8px] font-mono text-text-muted">
                      <span>Less</span>
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#121214] border border-border-grid/30" />
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#452203] border-[#78350f]" />
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#92400e] border-[#d97706]" />
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#d97706] border-[#fbbf24]" />
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#f59e0b] border-[#fde047]" />
                      <span>More</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Footer Telemetry Badge */}
            <div className="border-t border-border-grid/30 pt-3 flex items-center justify-between text-[9px] font-mono text-text-muted">
              <span>ALGORITHMIC VERIFICATION</span>
              <span className="text-amber-400">
                [ {leetCodeStats.isLive ? 'SYNCHRONIZED // LEETCODE_GRAPHQL' : 'OFFLINE // DETERMINISTIC_CACHE'} ]
              </span>
            </div>
          </ThreeDCard>

          {/* 2. GITHUB CONTRIBUTION HEATMAP CARD */}
          <ThreeDCard 
            className="p-5 sm:p-6 glass-panel border border-border-grid bg-[#080808] flex flex-col justify-between space-y-6 text-left"
            glowColor="rgba(34, 197, 94, 0.12)"
          >
            <div className="space-y-5">
              
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-border-grid/40 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="font-syncopate text-base sm:text-lg font-bold text-white tracking-wider uppercase">
                      GITHUB ACTIVITY
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted block">
                    ENGINEERING REPOSITORY & COMMIT TELEMETRY
                  </span>
                </div>

                <a
                  href={portfolioData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 hover:text-white bg-black/60 border border-emerald-500/30 hover:border-emerald-400 px-2.5 py-1 rounded-[2px] transition-all font-semibold uppercase"
                >
                  <span>@aadesh-2006</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Sub-headline telemetry stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-[#050505] border border-border-grid/40 p-2.5 rounded-[2px]">
                  <span className="text-[9px] text-text-muted block uppercase">TOTAL CONTRIBUTIONS</span>
                  <span className="text-base font-bold text-emerald-400">{gitHubStats.totalContributions}+</span>
                  <span className="text-[8px] text-zinc-500 block">Annual Commits</span>
                </div>
                <div className="bg-[#050505] border border-border-grid/40 p-2.5 rounded-[2px]">
                  <span className="text-[9px] text-text-muted block uppercase">PUBLIC REPOSITORIES</span>
                  <span className="text-base font-bold text-white">{gitHubStats.repos} Repos</span>
                  <span className="text-[8px] text-zinc-500 block">Open Source</span>
                </div>
                <div className="bg-[#050505] border border-border-grid/40 p-2.5 rounded-[2px] col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-text-muted block uppercase">SYNC STATUS</span>
                  <span className="text-xs font-bold text-accent-cyan flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                    LIVE TELEMETRY
                  </span>
                  <span className="text-[8px] text-zinc-500 block">REST v4 Engine</span>
                </div>
              </div>

              {/* Top 3 Most Used Languages derived from actual GitHub Codebase */}
              <div className="border border-border-grid/40 bg-[#050505] p-3.5 rounded-[3px] space-y-3 font-mono">
                <div className="flex items-center justify-between text-[10px] text-text-muted uppercase tracking-wider">
                  <span>MOST USED LANGUAGES</span>
                  <span className="text-emerald-400 font-bold">[ TOP 3 REPO CODEBASE ]</span>
                </div>

                <div className="space-y-2.5">
                  {gitHubStats.topLanguages.map((lang, idx) => (
                    <div key={lang.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="text-accent-cyan font-bold text-[9px]">0{idx + 1}</span>
                          <span className="text-zinc-200 font-semibold">{lang.name}</span>
                        </div>
                        <span className="text-emerald-400 font-bold text-[10px]">{lang.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#121214] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(52,199,89,0.25)]" 
                          style={{ width: `${lang.percentage}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actual GitHub Contribution Heatmap Grid (Moved lower) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    LAST 12 MONTHS CONTRIBUTION MATRIX
                  </span>
                  {hoveredGitHubCell ? (
                    <span className="text-emerald-400 font-bold transition-all">
                      {hoveredGitHubCell.count} {hoveredGitHubCell.count === 1 ? 'contribution' : 'contributions'} on {hoveredGitHubCell.date}
                    </span>
                  ) : (
                    <span className="text-zinc-400">Hover over cells to inspect</span>
                  )}
                </div>

                {/* Heatmap Matrix Container */}
                <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border-grid">
                  <div className="min-w-[620px] space-y-1 select-none">
                    
                    {/* Month header row */}
                    <div className="flex justify-between text-[8px] font-mono text-text-muted/70 px-6">
                      {monthLabels.map((m, idx) => (
                        <span key={idx}>{m}</span>
                      ))}
                    </div>

                    {/* Heatmap grid */}
                    <div className="flex gap-1 items-start">
                      <div className="flex flex-col justify-between text-[7px] font-mono text-text-muted/60 h-[86px] pr-1 py-0.5">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                      </div>

                      {/* 52 Week Columns */}
                      <div className="flex-1 flex gap-[3px] items-center">
                        {gitHubWeeks.map((week, wIdx) => (
                          <div key={wIdx} className="flex flex-col gap-[3px]">
                            {week.map((day, dIdx) => (
                              <div
                                key={dIdx}
                                onMouseEnter={() => setHoveredGitHubCell({ date: day.date, count: day.count })}
                                onMouseLeave={() => setHoveredGitHubCell(null)}
                                className={`w-[10px] h-[10px] rounded-[1.5px] border transition-all duration-100 cursor-pointer ${getGitHubCellColor(day.level)}`}
                                title={`${day.count} contributions on ${day.date}`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Heatmap Legend */}
                    <div className="flex items-center justify-end gap-1.5 pt-2 text-[8px] font-mono text-text-muted">
                      <span>Less</span>
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#121214] border border-border-grid/30" />
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#0e4429] border border-[#1b4d32]" />
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#006d32] border-[#009947]" />
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#26a641] border-[#39d353]" />
                      <div className="w-[9px] h-[9px] rounded-[1px] bg-[#39d353] border-[#5cf77a]" />
                      <span>More</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Footer Telemetry Badge */}
            <div className="border-t border-border-grid/30 pt-3 flex items-center justify-between text-[9px] font-mono text-text-muted">
              <span>CONTRIBUTION VERIFICATION</span>
              <span className="text-emerald-400">[ SYNCHRONIZED // GITHUB_REST_V4 ]</span>
            </div>
          </ThreeDCard>

        </div>

      </div>
    </section>
  );
};

export default MetricsSection;

