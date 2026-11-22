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
  videoUrl?: string;
  posterUrl?: string;
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
  email: "tusharbasak97@gmail.com",
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
      "Specialized in Open Source DB Systems, Cloud DB Systems, and In-Memory Data Management. Graduated with an 8.92 CGPA without any backlogs.",
    cgpaOrDistinction: "8.92 CGPA",
  },
  {
    period: "2016 - 2019",
    title: "Bachelor of Science (B.Sc)",
    organization: "Swami Vivekananda Subharti University, Meerut",
    description:
      "Physics, Chemistry, and Mathematics with Environmental Studies, graduating with a distinction of 68.5% and no backlogs.",
    cgpaOrDistinction: "68.5% Distinction",
  },
];

export const experienceTimeline: TimelineEntry[] = [
  {
    period: "Oct'24 - Aug'26",
    title: "IT Support Engineer (Project-Based, Off-Role)",
    organization: "Secure Life HR Service Private Ltd.",
    description:
      "Managed core networking and IT security operations including LAN/WAN troubleshooting, VLAN segmentation, VPN access, and firewall configuration. Hardened Windows 10/11 endpoints, enforced access controls, delivered Tier-1/Tier-2 desk support across client locations, and maintained IT asset inventory and security SOPs.",
  },
  {
    period: "Jan'23 - May'24",
    title: "Technical Consultant",
    organization: "Secure Life HR Service Private Ltd.",
    description:
      "Operated and supported enterprise workflows using SAP tools, assisting with daily data management, system transactions, and functional troubleshooting. Collaborated with teams to resolve application issues, streamline desk operations, assist with software deployment, system configuration, and user onboarding.",
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
    expectedDate: "2027",
    icon: "shield-halved",
  },
  {
    id: "cert-cissp",
    title: "CISSP",
    issuer: "(ISC)² - International Information System Security Certification Consortium",
    status: "coming-soon",
    expectedDate: "2027",
    icon: "user-shield",
  },
  {
    id: "cert-gsec",
    title: "GSEC",
    issuer: "SANS Institute",
    status: "coming-soon",
    expectedDate: "2027",
    icon: "graduation-cap",
  },
  {
    id: "cert-ejpt",
    title: "eJPT",
    issuer: "eLearnSecurity",
    status: "coming-soon",
    expectedDate: "2027",
    icon: "bug",
  },
  {
    id: "cert-oscp",
    title: "OSCP",
    issuer: "Offensive Security",
    status: "coming-soon",
    expectedDate: "2027",
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
    videoUrl: "/assets/images/portfolio/password-generator.webm",
    posterUrl: "/assets/images/portfolio/password-generator-poster.webp",
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
    videoUrl: "/assets/images/portfolio/todopomo.webm",
    posterUrl: "/assets/images/portfolio/todopomo-poster.webp",
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
    videoUrl: "/assets/images/portfolio/tic-tac-toe.webm",
    posterUrl: "/assets/images/portfolio/tic-tac-toe-poster.webp",
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
    videoUrl: "/assets/images/portfolio/bvdb.webm",
    posterUrl: "/assets/images/portfolio/bvdb-poster.webp",
    liveUrl: "https://bvdb.vercel.app/",
  },
  {
    id: "project-vayu",
    title: "The Vayu Project",
    category: "D2C E-Commerce",
    description:
      "A sleek, high-conversion landing page for a health-tech brand featuring interactive UI components.",
    imageUrl: "/assets/images/portfolio/vayu-azure.webp",
    videoUrl: "/assets/images/portfolio/vayu-azure.webm",
    posterUrl: "/assets/images/portfolio/vayu-azure-poster.webp",
    liveUrl: "https://vayu-azure.vercel.app/",
  },
  {
    id: "project-sapna",
    title: "Sapna Trading",
    category: "B2B Platform",
    description:
      "A comprehensive industrial trading website featuring specialized product categories for B2B clients.",
    imageUrl: "/assets/images/portfolio/st-plum.webp",
    videoUrl: "/assets/images/portfolio/st-plum.webm",
    posterUrl: "/assets/images/portfolio/st-plum-poster.webp",
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
  { label: "Contact", href: "#contact", icon: "envelope" },
];

