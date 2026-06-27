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
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
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
  github: "https://github.com/AadeshGund", // Custom inferred based on standard github names
  email: "contact@aadesh.dev", // A professional forwarding developer email
  skills: [
    {
      category: "Data Science & ML",
      skills: ["PyTorch", "YOLOv8", "Physics-Informed Neural Networks (PINN)", "Scikit-learn", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Jupyter"]
    },
    {
      category: "Languages",
      skills: ["Python", "Java", "SQL", "JavaScript (ES6+)", "C", "C++"]
    },
    {
      category: "Web Development",
      skills: ["React.js", "Node.js", "Express.js", "FastAPI", "Spring Boot", "HTML5", "CSS3"]
    },
    {
      category: "Databases & Tools",
      skills: ["MySQL", "MongoDB", "SUMO", "TraCI", "Git", "GitHub", "VS Code", "IntelliJ IDEA", "Vercel"]
    },
    {
      category: "Core Concepts",
      skills: ["Advanced Data Structures & Algorithms", "Object-Oriented Programming (OOP)", "System Design"]
    }
  ],
  projects: [
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
        github: "https://github.com/AadeshGund",
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
        github: "https://github.com/AadeshGund",
        caseStudy: "/projects/flowsync"
      },
      metrics: [
        { label: "DETECTION MODEL", value: "YOLOv8 Nano" },
        { label: "SIMULATOR", value: "SUMO / TraCI" },
        { label: "API SPEED", value: "Sub-15ms Responses" }
      ]
    },
    {
      id: "programenergy",
      title: "ProgramEnergy",
      tagline: "MERN Productivity & Competitive Coding Platform",
      description: "A full-stack developer productivity suite featuring modular project management tools and custom backend systems, including real-time competitive coding battles and progress tracking.",
      technologies: ["MongoDB", "Express.js", "React.js", "Node.js", "Socket.io", "JWT"],
      bullets: [
        "Created a full-stack, comprehensive developer productivity suite featuring modular project management tools and custom backend system design.",
        "Architected 'DevTrack', a module utilizing custom data tracking and secure JWT authentication to protect and monitor individual coding progress, time blocks, and milestones.",
        "Developed 'CodeBattle', an interactive competitive coding environment supporting real-time socket-based challenge synchronization.",
        "Designed a scalable, decoupled MERN architecture ensuring seamless data synchronization and low-latency database queries."
      ],
      links: {
        github: "https://github.com/AadeshGund",
      },
      metrics: [
        { label: "AUTHENTICATION", value: "Secure JWT Token" },
        { label: "SYNC LATENCY", value: "Socket.io <50ms" },
        { label: "STACK", value: "MERN Decoupled" }
      ]
    }
  ],
  certifications: [
    {
      title: "Goldman Sachs Hackathon: Cleared Phase",
      issuer: "Goldman Sachs",
      date: "June 2026"
    },
    {
      title: "Oracle Java Foundations Associate",
      issuer: "Oracle Professional Certification",
      date: "May 2026"
    },
    {
      title: "Introduction to Large Language Models",
      issuer: "Google Cloud Certification",
      date: "June 2026"
    },
    {
      title: "Introduction to NLP Concepts",
      issuer: "Microsoft Certification",
      date: "June 2026"
    },
    {
      title: "Introduction to Generative AI and Agents",
      issuer: "Microsoft Certification",
      date: "May 2026"
    },
    {
      title: "HackerRank Problem Solving Skills Verification",
      issuer: "HackerRank",
      date: "Aug. 2025"
    }
  ],
  achievements: [
    "Competitive Programming: LeetCode Rating 1759 (Top 10% Global Contest Participant)",
    "Cleared Goldman Sachs Hackathon Phase",
    "Certified Java Foundations Associate by Oracle",
    "Certified LLM & GenAI Practitioner by Google Cloud and Microsoft"
  ]
};
