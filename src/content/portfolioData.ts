export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  bullets: string[];
  links: {
    github?: string;
    demo?: string;
    caseStudy?: string;
  };
  metrics?: { label: string; value: string }[];
  statusText?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  proofImage?: string;
  credentialUrl?: string;
}

export interface PortfolioData {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  subrole: string;
  tagline: string;
  location: string;
  coordinates: string;
  linkedin: string;
  leetcode: string;
  github: string;
  email: string;
  resume: string;
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
}

export const portfolioData: PortfolioData = {
  name: "Aadesh Gund",
  firstName: "Aadesh",
  lastName: "Gund",
  role: "3rd Year Computer Science Student",
  subrole: "Intelligent Systems & Full-Stack Developer",
  tagline: "Building intelligent machine learning systems and low-latency digital infrastructures, one optimized model at a time.",
  location: "NCR, India",
  coordinates: "28.6139° N, 77.2090° E",
  linkedin: "https://www.linkedin.com/in/aadesh-gund-83b19a225/",
  leetcode: "https://leetcode.com/u/Aadesh_2006/",
  github: "https://github.com/aadesh-2006",
  email: "contact@aadesh.dev", // A professional forwarding developer email
  resume: "https://drive.google.com/file/d/1GdTcoSkrARVUdOOrpKRTbG1JMsLTuIXd/view?usp=sharing",
  skills: [
    {
      category: "Languages",
      skills: ["Python", "JavaScript", "TypeScript", "C++", "C", "Java", "SQL"]
    },
    {
      category: "Backend",
      skills: ["FastAPI", "Node.js", "Express.js", "REST APIs", "Spring Boot"]
    },
    {
      category: "Frontend",
      skills: ["React", "HTML5", "CSS3"]
    },
    {
      category: "Data Science & ML",
      skills: ["PyTorch", "NumPy", "Pandas", "Matplotlib", "Scikit-learn", "Jupyter", "Physics-Informed Neural Networks (PINN)", "YOLOv8"]
    },
    {
      category: "Databases & Tools",
      skills: ["MySQL", "MongoDB", "SQLite", "Git", "GitHub", "VS Code", "IntelliJ IDEA", "Vercel"]
    },
    {
      category: "Core Concepts",
      skills: ["Data Structures & Algorithms", "Object-Oriented Programming", "System Design"]
    }
  ],
  projects: [
    {
      id: "codespeed",
      title: "CodeSpeed",
      tagline: "Type code. Track speed. Improve.",
      description: "A developer-centric typing speed tracker designed specifically for programmers, benchmarking typing proficiency against real-world programming code snippets, syntax constructs, and indentation.",
      technologies: ["React 19", "Vite", "Node.js", "Express", "MongoDB", "JWT", "MERN"],
      bullets: [
        "Engineered interactive code typing engine with character-level accuracy scoring, custom Tab indentation, and timer subsystems.",
        "Constructed a 72-snippet taxonomy across 8 languages (JS, Python, Java, C++, C, HTML, CSS, SQL) and 3 difficulty tiers.",
        "Implemented deterministic WPM and accuracy formulations with division-by-zero handling and anti-tamper backend validation.",
        "Built stateless JWT authentication with bcryptjs password hashing and granular user privacy controls for practice statistics."
      ],
      links: {
        github: "https://github.com/aadesh-2006/CodeSpeed",
        caseStudy: "/projects/codespeed"
      },
      metrics: [
        { label: "SNIPPETS", value: "72 Curated Codes" },
        { label: "LANGUAGES", value: "8 Syntax Engines" },
        { label: "AUTH STACK", value: "JWT + bcryptjs" }
      ],
      statusText: "FULL-STACK // ACTIVE"
    },
    {
      id: "urbancadastral-ai",
      title: "UrbanCadastral AI",
      tagline: "CPU-First Aerial Building Footprint Extraction",
      description: "A lightweight, production-ready, CPU-first computer vision pipeline and interactive GIS workstation for automated Building Footprint Extraction from high-resolution aerial and satellite imagery.",
      technologies: ["Python", "PyTorch", "FastAPI", "React", "TypeScript", "Vite", "Tailwind CSS"],
      bullets: [
        "Engineered custom LightUNet architecture with 1.94M parameters achieving 76.54% Mean Dice (±7.07) and 62.53% Mean IoU.",
        "Optimized CPU-first inference achieving ~45.3 ms forward latency across 4 CPU threads on unseen SpaceNet 2 tiles.",
        "Maintains full GeoTIFF geospatial integrity with WGS84 / EPSG:4326 GeoJSON vector export and pixel-coordinate fallback.",
        "Developed an interactive GIS workstation with multi-layer rendering (RAW / MASK / OVERLAY) and dynamic opacity control."
      ],
      links: {
        github: "https://github.com/aadesh-2006/UrbanCadastral-AI-ML",
        caseStudy: "/projects/urbancadastral-ai"
      },
      metrics: [
        { label: "DICE METRIC", value: "76.54% (±7.07)" },
        { label: "CPU LATENCY", value: "~45.3 ms (4 Th)" },
        { label: "MODEL SIZE", value: "7.78 MB Checkpoint" }
      ],
      statusText: "PRODUCTION-READY // COMPILED"
    },
    {
      id: "ai-financial-research-analyst",
      title: "AI Financial Research Analyst",
      tagline: "Modular Financial Intelligence Platform",
      description: "A modular financial intelligence platform combining multi-source SEC EDGAR and market data ingestion, deterministic quantitative valuation analysis, and structured AI-powered research generation.",
      technologies: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "OpenAI", "Docker"],
      bullets: [
        "Ingested multi-source financial data from SEC EDGAR, yfinance, and news sources into normalized company data.",
        "Built a deterministic financial analysis engine covering growth, margins, returns, leverage, cash flow, valuation multiples, and financial health.",
        "Implemented DCF and WACC valuation with 2D sensitivity analysis and explicit model assumptions.",
        "Added a grounded LLM research layer that is prohibited from calculating or inventing financial numbers."
      ],
      links: {
        github: "https://github.com/aadesh-2006/ai-financial-research-analyst",
        caseStudy: "/projects/ai-financial-research-analyst"
      },
      metrics: [
        { label: "ENGINE", value: "Deterministic Quant" },
        { label: "SYNTHESIS", value: "Grounded LLM Layer" },
        { label: "PERSISTENCE", value: "PostgreSQL 17" }
      ],
      statusText: "PRODUCTION-ORIENTED // COMPILED"
    },
    {
      id: "aerofind",
      title: "AeroFind",
      tagline: "Physics-Informed ML Satellite Tracking",
      description: "A predictive machine learning model to track and locate lost satellites by analyzing orbital history, velocity, and trajectory telemetry. Resolves complex orbital drift using physics equations integrated into neural network training loops.",
      technologies: ["Python", "PyTorch", "DeepXDE", "NumPy", "Pandas", "Scikit-learn"],
      bullets: [
        "Developed a predictive machine learning model to track and locate lost satellites by analyzing orbital history, velocity, and trajectory data.",
        "Implemented Physics-Informed Neural Networks (PINNs) to integrate physical orbital laws into the neural network loss function, enhancing localization accuracy for complex, non-linear dynamics.",
        "Engineered an automated data pipeline using Pandas and NumPy to preprocess large-scale satellite telemetry data, predicting future coordinates with high precision."
      ],
      links: {
        github: "https://github.com/aadesh-2006",
        caseStudy: "/projects/aerofind"
      },
      metrics: [
        { label: "FRAMEWORK", value: "DeepXDE / PINN" },
        { label: "LOSS METRIC", value: "Physics-Regulated" },
        { label: "COMPUTE", value: "PyTorch GPU" }
      ]
    },
    {
      id: "flowsync",
      title: "FlowSync",
      tagline: "AI-Driven Traffic Signal Optimizer",
      description: "An intelligent traffic controller system designed to optimize real-time vehicle flow and mitigate urban congestion. Replaces static timers with dynamic timer delay equations based on real-time vehicle density estimates.",
      technologies: ["YOLOv8", "SUMO", "TraCI", "FastAPI", "React", "Python"],
      bullets: [
        "Designed and built an AI-driven traffic controller system utilizing robust software system design principles to optimize real-time vehicle flow and mitigate urban congestion.",
        "Integrated YOLOv8 computer vision models for accurate real-time object detection and vehicle density monitoring from simulated camera feeds.",
        "Utilized TraCI API to bridge real-world traffic logic with the SUMO simulation environment, dynamically altering traffic signal timings.",
        "Developed a high-performance FastAPI backend and a responsive React dashboard to visualize real-time traffic metrics and system efficiency."
      ],
      links: {
        github: "https://github.com/aadesh-2006",
        caseStudy: "/projects/flowsync"
      },
      metrics: [
        { label: "DETECTION MODEL", value: "YOLOv8 Nano" },
        { label: "SIMULATOR", value: "SUMO / TraCI" },
        { label: "API SPEED", value: "Sub-15ms Responses" }
      ]
    },
    {
      id: "wealthtrack",
      title: "WealthTrack",
      tagline: "Personal Finance & Investment Tracker",
      description: "An individual-user personal finance and investment portfolio management web application where users can track daily finances, holdings, and investment performance from transaction history and live market data.",
      technologies: ["MongoDB", "Express.js", "React", "Node.js", "Groww API", "MERN"],
      bullets: [
        "Automated portfolio value, realized/unrealized P&L, return %, and asset allocation tracking from transaction history.",
        "Integrated Groww API for syncing holdings, trades, transactions, and live market prices.",
        "Historical performance charts, income & expense monitoring, and transaction search with secure authentication."
      ],
      links: {
        caseStudy: "/projects/wealthtrack"
      },
      metrics: [
        { label: "SYNC SYSTEM", value: "Groww API Sync" },
        { label: "STACK", value: "MERN Architecture" }
      ],
      statusText: "BUILDING // IN_DEVELOPMENT"
    },
    {
      id: "intellirag",
      title: "IntelliRAG",
      tagline: "Document Question Answering System",
      description: "A document question-answering system using Retrieval-Augmented Generation (RAG). Extracts, chunks, embeds, and retrieves document content to generate answers grounded in retrieved document context.",
      technologies: ["Python", "FastAPI", "React", "Vector DB", "LLM", "Embeddings", "RAG"],
      bullets: [
        "PDF text extraction, intelligent document chunking, and vector embedding storage for semantic similarity retrieval.",
        "Grounded LLM-based answer generation with source/citation references and conversational document context.",
        "Modular RAG pipeline architecture engineered for future hybrid retrieval and reranking extensions."
      ],
      links: {
        caseStudy: "/projects/intellirag"
      },
      metrics: [
        { label: "PIPELINE", value: "Retrieval-Augmented Gen" },
        { label: "SEARCH ENGINE", value: "Semantic Vector Search" }
      ],
      statusText: "BUILDING // IN_DEVELOPMENT"
    }
  ],
  certifications: [
    {
      title: "Goldman Sachs Hackathon: Cleared Phase",
      issuer: "Goldman Sachs",
      date: "June 2026",
      proofImage: "/goldman-sachs-hackathon-proof.png"
    },
    {
      title: "Oracle Java Foundations Associate",
      issuer: "Oracle Professional Certification",
      date: "May 2026"
    },
    {
      title: "Introduction to Large Language Models",
      issuer: "GOOGLE CLOUD / SIMPLILEARN",
      date: "June 2026",
      proofImage: "/google-cloud-simplilearn-llm-certificate.png",
      credentialUrl: "https://simpli-web.app.link/e/W6iZzMDkH3b"
    },
    {
      title: "Introduction to NLP Concepts",
      issuer: "Microsoft Learn",
      date: "June 2026",
      proofImage: "/microsoft-nlp-certificate.png",
      credentialUrl: "https://learn.microsoft.com/api/achievements/share/en-us/AadeshGund-8991/ABQWBS37?sharingId=4D67E1278FADBE76"
    },
    {
      title: "Introduction to Generative AI and Agents",
      issuer: "Microsoft Learn",
      date: "May 2026",
      proofImage: "/microsoft-generative-ai-agents-certificate.png",
      credentialUrl: "https://learn.microsoft.com/api/achievements/share/en-us/AadeshGund-8991/P6JN7EW4?sharingId=4D67E1278FADBE76"
    },
    {
      title: "HackerRank Problem Solving Skills Verification",
      issuer: "HackerRank",
      date: "Aug. 2025",
      proofImage: "/hackerrank-problem-solving-certificate.png",
      credentialUrl: "https://www.hackerrank.com/certificates/iframe/13ab54f87f46"
    }
  ],
  achievements: [
    "Competitive Programming: LeetCode Rating 1759 (Top 10% Global Contest Participant)",
    "Cleared Goldman Sachs Hackathon Phase",
    "Certified Java Foundations Associate by Oracle",
    "Certified LLM & GenAI Practitioner by Google Cloud and Microsoft"
  ]
};
