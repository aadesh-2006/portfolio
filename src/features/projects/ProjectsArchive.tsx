import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react';


interface ProjectCardData {
  sysId: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  highlights: string[];
  metricLabel: string;
  metricValue: string;
  link: string;
  statusText: string;
  github?: string;
}

const ARCHIVE_PROJECTS: ProjectCardData[] = [
  {
    sysId: '● FLOWSYNC_SYS',
    title: 'FlowSync',
    subtitle: 'AI-DRIVEN TRAFFIC SIGNAL OPTIMIZER',
    description: 'An intelligent traffic management system utilizing computer vision object detection to measure real-time queue lengths and dynamically adjust traffic signals. Reduces urban congestion and carbon footprint.',
    tags: ['YOLOv8', 'OpenCV', 'FastAPI', 'React', 'Python'],
    highlights: [
      'Implemented real-time object detection using YOLOv8 Nano model for vehicle count extraction.',
      'Developed a scheduling algorithm that computes dynamic green-light durations based on traffic density.',
      'Utilized OpenCV to define Region of Interest (ROI) boundaries over traffic lanes for queue estimation.',
      'Designed a lightweight dashboard showing active video streams and signal junction metrics.'
    ],
    metricLabel: 'DETECTION MODEL',
    metricValue: 'YOLOv8 Nano',
    link: '/projects/flowsync',
    statusText: 'COMPILED_SUCCESS',
    github: 'https://github.com/AadeshGund'
  },
  {
    sysId: '● PROGENERGY_SYS',
    title: 'ProgramEnergy',
    subtitle: 'RENEWABLE MICROGRID LOAD BALANCER',
    description: 'A distributed energy management system designed to balance local renewable energy production and load profiles. Manages solar generator output, local battery arrays, and main grid power schedules.',
    tags: ['React', 'Spring Boot', 'MongoDB', 'Java', 'REST APIs'],
    highlights: [
      'Developed a full-stack dashboard in React and Java (Spring Boot) to monitor battery state of charge (SoC) and solar production.',
      'Implemented REST APIs for low-latency telemetry acquisition and grid power schedule delivery.',
      'Created a scheduling algorithm to optimize battery storage usage based on time-of-use tariffs.',
      'Stored timeseries load profiles and telemetry logs in MongoDB for historic performance audits.'
    ],
    metricLabel: 'DATABASE SCHEMA',
    metricValue: 'MongoDB / Timeseries',
    link: '/projects/programenergy',
    statusText: 'ONLINE_SUCCESS',
    github: 'https://github.com/AadeshGund'
  },
  {
    sysId: '● PEERBRIDGE_SYS',
    title: 'PeerBridge',
    subtitle: 'SECURE PEER-TO-PEER DATA SYNC PIPELINE',
    description: 'A decentralized WebRTC-based communication application enabling direct peer-to-peer audio, video, and text synchronization over local networks and internet tunnels without centralized data servers.',
    tags: ['WebRTC', 'React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JavaScript'],
    highlights: [
      'Built secure, low-latency peer-to-peer data channels using WebRTC peer connections.',
      'Created a signaling server in Node.js (Express) with Socket.io for peer handshakes and room discovery.',
      'Developed React client interface showcasing peer state, connection stability, and real-time messaging.',
      'Stored signaling credentials and user session variables in MongoDB database.'
    ],
    metricLabel: 'SIGNALING PROTOCOL',
    metricValue: 'Socket.io / WebRTC',
    link: '/projects/peerbridge',
    statusText: 'TUNNEL_ESTABLISHED',
    github: 'https://github.com/AadeshGund'
  },
  {
    sysId: '● AEROFIND_SYS',
    title: 'AeroFind',
    subtitle: 'PHYSICS-INFORMED ML SATELLITE TRACKING',
    description: 'A predictive machine learning model to track and locate lost satellites by analyzing orbital history, velocity, and trajectory telemetry. Resolves complex orbital drift using physics equations integrated into neural network training loops.',
    tags: ['Python', 'PyTorch', 'DeepXDE', 'NumPy', 'Pandas', 'Scikit-learn'],
    highlights: [
      'Developed a predictive machine learning model to track and locate lost satellites by analyzing orbital history, velocity, and trajectory data.',
      'Implemented Physics-Informed Neural Networks (PINNs) to integrate physical orbital laws into the neural network loss function, enhancing localization accuracy for complex, non-linear dynamics.',
      'Engineered an automated data pipeline using Pandas and NumPy to preprocess large-scale satellite telemetry data, predicting future coordinates with high precision.'
    ],
    metricLabel: 'FRAMEWORK',
    metricValue: 'DeepXDE / PINN',
    link: '/projects/aerofind',
    statusText: 'COMPILED_SUCCESS',
    github: 'https://github.com/AadeshGund'
  }
];

export const ProjectsArchive: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#030014] text-text-main select-text pb-24">
      {/* Back to Hub Nav */}
      <div className="border-b border-border-grid px-6 py-4 flex items-center bg-canvas-bg/10 select-none">
        <Button variant="link" to="/" className="inline-flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Hub
        </Button>
      </div>

      {/* Page Header */}
      <div className="max-w-[1100px] mx-auto w-full px-6 pt-12 pb-8 text-left space-y-6">
        <div className="border-b border-border-grid pb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-mono text-accent-cyan tracking-[0.2em] font-semibold uppercase text-glow-cyan block mb-2">
                [ PROJECT_ARCHIVE ]
              </span>
              <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-text-main">
                Engineering Case Files
              </h1>
              <p className="text-sm font-sans text-text-muted mt-2 max-w-xl leading-relaxed">
                Browse documented engineering systems, AI experiments, backend infrastructures, and software architectures.
              </p>
            </div>
            <div className="flex gap-6 font-mono text-xs text-right mt-1 bg-surface-bg border border-border-grid p-4 rounded-[4px]">
              <div>
                <span className="text-text-muted uppercase tracking-wider block text-[10px]">TOTAL_CASES</span>
                <span className="text-lg font-bold text-accent-purple text-glow-purple">4</span>
              </div>
              <div className="border-l border-border-grid pl-6">
                <span className="text-text-muted uppercase tracking-wider block text-[10px]">STATUS</span>
                <span className="text-lg font-bold text-accent-cyan text-glow-cyan">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Cards Dossier List */}
      <div className="max-w-[1100px] mx-auto w-full px-6 space-y-12">
        {ARCHIVE_PROJECTS.map((proj, pIdx) => (
          <div
            key={proj.title}
            className="group block border border-border-grid rounded-[4px] bg-surface-bg hover:border-accent-cyan/40 hover:-translate-y-1 transition-all duration-300 ease-damping p-6 md:p-8 space-y-6 text-left cursor-pointer"
            onClick={() => navigate(proj.link)}
          >
            {/* Top Bar with System ID */}
            <div className="flex justify-between items-center select-none">
              <span className="text-[10px] font-mono font-medium text-accent-cyan tracking-wider uppercase">
                {proj.sysId}
              </span>
              <div className="flex items-center gap-4">
                {proj.github && (
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-muted hover:text-accent-cyan transition-colors"
                    aria-label="GitHub link"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                <span className="text-[10px] font-mono font-medium text-text-muted tracking-wider uppercase">
                  [ SECURE_ENTRY // 0{pIdx + 1} ]
                </span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-text-main group-hover:text-glow-cyan transition-all duration-300">
                {proj.title}
              </h2>
              <h3 className="text-xs font-mono font-semibold text-accent-purple uppercase tracking-wider">
                {proj.subtitle}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm font-sans text-text-muted leading-relaxed max-w-3xl">
              {proj.description}
            </p>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 select-none">
              {proj.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono bg-canvas-bg border border-border-grid px-2.5 py-1 rounded-[2px] text-text-muted group-hover:border-accent-cyan/25 group-hover:text-text-main transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Highlights List */}
            <div className="space-y-2.5 border-t border-border-grid/50 pt-5 text-sm font-mono text-text-muted select-text">
              {proj.highlights.map((hl, hlIdx) => (
                <div key={hlIdx} className="flex items-start gap-2">
                  <span className="text-accent-cyan select-none font-bold">&gt;</span>
                  <span className="leading-relaxed font-sans text-xs text-text-muted">{hl}</span>
                </div>
              ))}
            </div>

            {/* Footer Row (Metrics & CTA Link) */}
            <div className="border-t border-border-grid/50 pt-5 flex justify-between items-end flex-wrap gap-4 select-none">
              {/* Metric Block */}
              <div className="font-mono">
                <span className="text-[10px] text-text-muted block uppercase tracking-wider">SYS_METRIC</span>
                <span className="text-xs font-semibold text-accent-cyan uppercase mt-1 block">
                  {proj.metricLabel}: {proj.metricValue}
                </span>
              </div>

              {/* Status and Action Link Button */}
              <div className="flex items-center gap-6">
                <span className="hidden sm:inline text-[10px] font-mono text-text-muted uppercase tracking-wider">
                  [ {proj.statusText} ]
                </span>
                <Button
                  variant="primary"
                  to={proj.link}
                  className="group-hover:bg-accent-cyan group-hover:text-white transition-all duration-300"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  DIAGNOSE CASE →
                </Button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
