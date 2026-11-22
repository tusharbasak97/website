export interface PersonalInfo {
  name: string;
  alternateName: string;
  titles: string[];
  jobTitle: string;
  description: string;
  aboutP1: string;
  aboutP2: string;
  birthday: string; // ISO format or display
  birthdayDisplay: string;
  email: string;
  whatsapp: string;
  degree: string;
  location: string;
  resumeUrl: string;
  hireMeUrl: string;
  avatarUrl: string;
}

export interface Skill {
  name: string;
  percentage: number;
}

export interface TimelineEntry {
  period: string;
  title: string;
  organization: string;
  description: string;
  cgpaOrDistinction?: string;
}

export type CertificateStatus = "active" | "expired" | "coming-soon";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  status: CertificateStatus;
  issueDate?: string;
  expiryDate?: string;
  expectedDate?: string;
  icon: string; // fa icon name e.g. "shield-halved", "user-shield", "graduation-cap", "bug", "terminal"
  verifyUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // icon name or identifier
  label: string;
}

export const personalInfo: PersonalInfo = {
  name: "Tushar Basak",
  alternateName: "CyberBasak",
  jobTitle: "Cybersecurity Analyst & Web Developer",
  titles: [
    "Cybersecurity Analyst",
    "Penetration Tester",
    "Network Administrator",
    "System Administrator",
    "Network Engineer",
    "IT Manager",
    "IT Security Analyst",
    "IT Support Specialist",
    "Cloud Security Analyst",
    "Security Engineer",
    "Security Consultant",
    "Security Architect",
  ],
  description:
    "Versatile professional bridging the gap between secure infrastructure and dynamic web experiences. As a Cybersecurity Analyst, I specialize in vulnerability assessment, SOC operations, and network security. Simultaneously, as a Web Developer, I create responsive, interactive, and secure web applications. Proficient in Python, JavaScript, and advanced security tools. I bring a holistic approach to building and protecting digital assets.",
  aboutP1:
    'Passionate technology professional with a unique blend of skills in Cybersecurity and Web Development. On the security side, I am a SOC Analyst with hands-on experience in penetration testing, ethical hacking, threat hunting, and SIEM operations. I specialize in identifying vulnerabilities and implementing robust defenses. Certified in various security domains, I apply a "security-first" mindset to everything I build.',
  aboutP2:
    "On the web development side, I am a Web Developer with hands-on experience in creating responsive, interactive, and secure web applications. I specialize in building dynamic, user-friendly interfaces and ensuring the security of the applications I create.",
  birthday: "1997-10-02",
  birthdayDisplay: "02 Oct 1997",
  email: "tushar.basak9936@gmail.com",
  whatsapp: "https://wa.link/pwvy3u",
  degree: "MCA [PG]",
  location: "India",
  resumeUrl: "/assets/resume.pdf",
  hireMeUrl: "https://bit.ly/basaklinkedin",
  avatarUrl: "/assets/images/hero.webp",
};

export const typingStrings: string[] = [
  "Cybersecurity Analyst",
  "Penetration Tester",
  "Network Administrator",
  "System Administrator",
  "Network Engineer",
  "IT Manager",
  "IT Security Analyst",
  "IT Support Specialist",
  "Cloud Security Analyst",
  "Security Engineer",
  "Security Consultant",
  "Security Architect",
];

export const skills: Skill[] = [
  { name: "Python", percentage: 96 },
  { name: "Bash", percentage: 90 },
  { name: "Shell", percentage: 85 },
  { name: "Cloud", percentage: 90 },
];

export const educationTimeline: TimelineEntry[] = [
  {
    period: "2021 - 2023",
    title: "Master of Computer Applications (MCA)",
    organization: "Manipal University Jaipur",
    description:
      "Specialized in both Open Source DB Systems and Cloud DB Systems with a Seminar on In-Memory Data Management. Achieved 8.92 CGPA without any backlogs.",
    cgpaOrDistinction: "8.92 CGPA",
  },
  {
    period: "2017 - 2020",
    title: "Bachelor of Science (B.Sc)",
    organization: "Swami Vivekananda Subharti University, Meerut",
    description:
      "Physics, Chemistry, and Mathematics with Environmental Studies, graduating with a distinction of 68.5% and no backlogs.",
    cgpaOrDistinction: "68.5% Distinction",
  },
];

export const experienceTimeline: TimelineEntry[] = [
  {
    period: "Jan'23 - Jan'26",
    title: "IT Support Engineer",
    organization: "Secure Life HR Service",
    description:
      "Provided technical support for Windows systems, hardware, and networks. Troubleshooted issues, implemented security measures, and ensured smooth operations.",
  },
];

export const certificates: Certificate[] = [
  {
    id: "cert-strive",
    title: "Cybersecurity Trainee",
    issuer: "Tata Strive | SAP India",
    status: "active",
    issueDate: "Sep 07, 2024",
    expiryDate: "Lifetime",
    icon: "shield-halved",
    verifyUrl: "/assets/Strive.pdf",
  },
  {
    id: "cert-sec-plus",
    title: "CompTIA Security+",
    issuer: "CompTIA",
    status: "coming-soon",
    expectedDate: "2026",
    icon: "shield-halved",
  },
  {
    id: "cert-cissp",
    title: "CISSP",
    issuer: "(ISC)² - International Information System Security Certification Consortium",
    status: "coming-soon",
    expectedDate: "2026",
    icon: "user-shield",
  },
  {
    id: "cert-gsec",
    title: "GSEC",
    issuer: "SANS Institute",
    status: "coming-soon",
    expectedDate: "2026",
    icon: "graduation-cap",
  },
  {
    id: "cert-ejpt",
    title: "eJPT",
    issuer: "eLearnSecurity",
    status: "coming-soon",
    expectedDate: "2026",
    icon: "bug",
  },
  {
    id: "cert-oscp",
    title: "OSCP",
    issuer: "Offensive Security",
    status: "coming-soon",
    expectedDate: "2026",
    icon: "terminal",
  },
];

export const projects: Project[] = [
  {
    id: "project-passg",
    title: "Password Generator",
    category: "Security Tool",
    description:
      "Advanced password generator featuring entropy calculation, XKCD passwords, and sanitization modes.",
    imageUrl: "/assets/images/portfolio/password-generator.webp",
    liveUrl: "https://pass-g-kohl.vercel.app",
    githubUrl: "https://github.com/tusharbasak97/passG",
  },
  {
    id: "project-todopomo",
    title: "TodoPomo",
    category: "Productivity App",
    description:
      "A productivity application combining a Todo list with a Pomodoro timer for maximum efficiency.",
    imageUrl: "/assets/images/portfolio/todopomo.webp",
    liveUrl: "https://tusharbasak97.github.io/todopomo/",
    githubUrl: "https://github.com/tusharbasak97/todopomo",
  },
  {
    id: "project-tictactoe",
    title: "Tic-Tac-Toe",
    category: "Web Game",
    description:
      "A responsive Tic-Tac-Toe game featuring a clean UI and smooth gameplay mechanics.",
    imageUrl: "/assets/images/portfolio/tic-tac-toe.webp",
    liveUrl: "https://tusharbasak97.github.io/tic-tac-toe/",
    githubUrl: "https://github.com/tusharbasak97/tic-tac-toe",
  },
  {
    id: "project-bvdb",
    title: "BVDB",
    category: "E-Commerce",
    description:
      "A high-end spiritual commerce platform dedicated to authentic Vedic beads with a dark premium aesthetic.",
    imageUrl: "/assets/images/portfolio/bvdb.webp",
    liveUrl: "https://bvdb.vercel.app/",
  },
  {
    id: "project-vayu",
    title: "The Vayu Project",
    category: "D2C E-Commerce",
    description:
      "A sleek, high-conversion landing page for a health-tech brand featuring interactive UI components.",
    imageUrl: "/assets/images/portfolio/vayu-azure.webp",
    liveUrl: "https://vayu-azure.vercel.app/",
  },
  {
    id: "project-sapna",
    title: "Sapna Trading",
    category: "B2B Platform",
    description:
      "A comprehensive industrial trading website featuring specialized product categories for B2B clients.",
    imageUrl: "/assets/images/portfolio/st-plum.webp",
    liveUrl: "https://st-plum.vercel.app/",
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://bit.ly/basakgithub",
    icon: "github",
    label: "Visit Tushar Basak's GitHub Profile",
  },
  {
    platform: "LinkedIn",
    url: "https://bit.ly/basaklinkedin",
    icon: "linkedin",
    label: "Connect with Tushar Basak on LinkedIn",
  },
  {
    platform: "TryHackMe",
    url: "https://tryhackme.com/p/tusharbasak97",
    icon: "user-secret",
    label: "View Tushar Basak's TryHackMe Profile",
  },
  {
    platform: "Medium",
    url: "https://medium.com/@tusharbasak97/",
    icon: "medium",
    label: "Read Tushar Basak's Articles on Medium",
  },
];

export const navItems = [
  { label: "Home", href: "#home", icon: "home" },
  { label: "About", href: "#about", icon: "user" },
  { label: "Certificates", href: "#certificates", icon: "certificate" },
  { label: "Projects", href: "#portfolio", icon: "code-fork" },
];

