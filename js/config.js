/*
 * config.js — PERSONAL DATA
 * Edit ONLY this file to change name, skills, experience, projects, links, etc.
 * No need to touch any other file.
 */

window.__CONFIG = {
  /* --- identity ---------------------------------------------------------- */
  username: "otaviozanon",
  siteTitle: "otaviozanon@github ~ interactive terminal",
  tagline: "Front-End Developer",
  metaDescription: "Otavio Zanon — interactive terminal-style GitHub profile.",

  /* --- banner ASCII (page header) ---------------------------------------- */
  banner:
    "   ___  _              _         _____                       \n" +
    "  / _ \\| |_ __ ___   _(_) ___   |__  /__ _ _ __   ___  _ __  \n" +
    "| | | __/ _` | \\ \\ / / |/ _ \\    / // _` | '_ \\ / _ \\| '_ \\ \n" +
    " | |_| | || (_| |\\ V /| | (_) |  / /| (_| | | | | (_) | | | | \n" +
    "  \\___/ \\__\\__,_| \\_/ |_|\\___/  /____\\__,_|_| |_|\\___/|_| |_| ",

  /* --- footer links + 'open' command ------------------------------------- */
  openLinks: {
    portfolio: {
      url: "https://otaviozanon.vercel.app",
      label: "portfolio",
    },
    linkedin: {
      url: "https://www.linkedin.com/in/otavio-zanon-820512183/",
      label: "linkedin",
    },
    github: {
      url: "https://github.com/otaviozanon",
      label: "github",
    },
    email: {
      url: "mailto:otaviozanonn@icloud.com",
      label: "email",
    },
  },

  /* --- command: whoami --------------------------------------------------- */
  whoami: [
    "Otavio Zanon",
    "Brazilian, Curitiba/PR, Brazil",
    "Front-End Engineer with 8+ years of experience in Web Development and Process Optimization.",
    "Proficient in various technologies and equipped with a versatile, adaptable skill set",
    "Collaborative, results-driven, and proactive — strong code-review and pair-programming culture.",
    "Always expanding knowledge, exploring new technologies and continuously evolving.",
  ],

  /* --- command: experience ----------------------------------------------- */
  experience: [
    {
      period: "2022 - now",
      role: "Frontend Engineer",
      company: "Cyncly",
      summary:
        "Front-end development for the world's leading furniture ERP. Driving React and UI innovations while defining processes and standards.",
      tech: "React, TypeScript, DevExtreme, Less, SQL, Pascal/Delphi, Git",
    },
    {
      period: "2021 - 2022",
      role: "Frontend Engineer",
      company: "Fohat",
      summary:
        "Agile development of internal applications — features, bug fixes and task management.",
      tech: "React, Next.js, GraphQL, PostgreSQL",
    },
    {
      period: "2020 - 2021",
      role: "FullStack Developer",
      company: "BRX Retail",
      summary:
        "Agile development of internal applications — features, bug fixes and task management.",
      tech: ".NET Core, C#, ASP.NET MVC, Angular, TypeScript",
    },
    {
      period: "2018 - 2020",
      role: "Process Developer",
      company: "Volvo Group",
      summary:
        "Lead the first Industry 4.0 team at Volvo do Brasil — cost reduction and production support.",
      tech: "React, IONIC, Node RED, Arduino, ShellScript, C#",
    },
    {
      period: "2017 - 2018",
      role: "Mobile Developer",
      company: "Obra Prima",
      summary: "Built Obra Prima App with web parity.",
      tech: "IONIC, VB.NET, ASP.NET, SQL",
    },
  ],

  /* --- command: education ------------------------------------------------ */
  education: [
    {
      period: "2016 - 2020",
      degree: "Bachelor, Information Systems",
      institution: "Universidade Positivo",
    },
  ],

  /* --- command: certifications ------------------------------------------- */
  certifications: [
    { year: "2022", name: "Explorer Program", issuer: "Rocketseat" },
    {
      year: "2021",
      name: "Development Web Applications with React",
      issuer: "Udemy",
    },
    {
      year: "2020",
      name: "LeanSixSigma Yellow Belt Certification",
      issuer: "Volvo Group",
    },
    {
      year: "2019",
      name: "OKR Methodology and Application",
      issuer: "Volvo Group",
    },
    {
      year: "2019",
      name: "LeanSixSigma White Belt Certification",
      issuer: "Volvo Group",
    },
    {
      year: "2018",
      name: "Oficina de Testes de Software",
      issuer: "Prime Control",
    },
    { year: "2018", name: "Ethical Hacking", issuer: "Udemy" },
    { year: "2013", name: "English Graduation", issuer: "CCAA" },
  ],

  /* --- languages (shown inside education command) -------------------------- */
  languages: [
    { level: "Advanced", language: "English" },
    { level: "Native", language: "Portuguese" },
    { level: "Basic", language: "Spanish" },
  ],

  /* --- command: skills --------------------------------------------------- */
  skillCategories: [
    { category: "languages", items: "JavaScript, TypeScript, Python, C#" },
    { category: "frontend", items: "React, Next.js, Angular, Redux" },
    {
      category: "styling",
      items: "TailwindCSS, Bootstrap, AntDesign, Less, DevExtreme",
    },
    { category: "backend", items: "Node.js, .NET Core, ASP.NET MVC, GraphQL" },
    {
      category: "databases",
      items: "MySQL, PostgreSQL, SQLite, SQL Server, Supabase, Firebase",
    },
    { category: "cloud", items: "AWS, Azure, Cloudflare, Vercel" },
    {
      category: "tools",
      items: "Git, Vite, Docker, PowerShell, Scrum, Microsoft DevOps",
    },
  ],

  /* --- command: projects (grouped by category) --------------------------- */
  projectCategories: [
    {
      category: "sites",
      projects: [
        {
          name: "Ranalli Advocacia",
          description: "Corporate website for a law firm with logistics tools",
          tech: "WordPress, React, TailwindCSS, TypeScript",
          live: "https://ranalliadvocacia.com.br",
          code: "",
        },
        {
          name: "Escola 123",
          description: "Nursery and early childhood center website",
          tech: "React, TypeScript, TailwindCSS",
          live: "https://escola123.com.br",
          code: "",
        },
        {
          name: "GlamPro",
          description: "Service scheduling for beauty professionals",
          tech: "React, Next.js, TailwindCSS, TypeScript",
          live: "",
          code: "https://github.com/otaviozanon/GlamPro",
        },
      ],
    },
    {
      category: "utils",
      projects: [
        {
          name: "EsportCalendar",
          description: "Automatic esport calendar generator in .ics format.",
          tech: "JavaScript, HTML5, CSS3",
          live: "https://otaviozanon.github.io/esportCalendar",
          code: "https://github.com/otaviozanon/esportCalendar",
        },
        {
          name: "LiveWatch",
          description:
            "Automated IPTV playlist — all triggered from a terminal-style web dashboard",
          tech: "JavaScript, HTML5, CSS3",
          live: "http://ozlivewatch.pages.dev",
          code: "https://github.com/otaviozanon/LiveWatch",
        },
        {
          name: "SettPaste",
          description:
            "Online notepad to create and share code or what you want",
          tech: "JavaScript, HTML5, CSS3",
          live: "http://settpaste.vercel.app",
          code: "https://github.com/otaviozanon/settpaste",
        },
        {
          name: "SettFile",
          description: "Multi-provider file uploader with progress tracking",
          tech: "React, TypeScript, Node.js, TailwindCSS",
          live: "https://settfile.onrender.com",
          code: "https://github.com/otaviozanon/settfile",
        },
      ],
    },
    {
      category: "desktop",
      projects: [
        {
          name: "SettUtility",
          description:
            "Windows optimization and gaming performance toolkit and extension",
          tech: "PowerShell",
          live: "",
          code: "https://github.com/otaviozanon/SettUtility",
        },
        {
          name: "SETTMemoryCleaner",
          description:
            "Portable RAM optimizer. Uses native Windows APIs to safely clear memory.",
          tech: "C#, PowerShell",
          live: "",
          code: "https://github.com/otaviozanon/SETTMemoryCleaner",
        },
      ],
    },
    {
      category: "games",
      projects: [
        {
          name: "Otto",
          description: "Uno (Multiplayer)",
          tech: "TypeScript, Next.js, Socket.io, TailwindCSS",
          live: "http://ottogame.onrender.com",
          code: "https://github.com/otaviozanon/otto",
        },
        {
          name: "NoWay",
          description: "A bluffing and trivia game (Multiplayer)",
          tech: "TypeScript, Next.js, Socket.io, TailwindCSS",
          live: "http://nowaygame.onrender.com",
          code: "https://github.com/otaviozanon/NoWay",
        },
        {
          name: "WorstFriend",
          description: "A true validator for the worst friend (Multiplayer)",
          tech: "TypeScript, Next.js, Socket.io, TailwindCSS",
          live: "http://worstfriendgame.onrender.com",
          code: "https://github.com/otaviozanon/WorstFriend",
        },
        {
          name: "Ventuno",
          description: "Blackjack - 21 (Multiplayer)",
          tech: "TypeScript, Next.js, Socket.io, TailwindCSS",
          live: "http://ventunogame.onrender.com",
          code: "https://github.com/otaviozanon/Ventuno",
        },
        {
          name: "Blackjack PRO",
          description: "Blackjack PRO (Solo)",
          tech: "React, TypeScript, TailwindCSS",
          live: "http://blackjack-pro-seven.vercel.app",
          code: "https://github.com/otaviozanon/Blackjack",
        },
      ],
    },
  ],

  /* --- command: contact -------------------------------------------------- */
  contact: [
    ["portfolio", "https://otaviozanon.vercel.app", "otaviozanon.vercel.app"],
    [
      "linkedin",
      "https://www.linkedin.com/in/otavio-zanon-820512183/",
      "linkedin.com/in/otavio-zanon",
    ],
    ["github", "https://github.com/otaviozanon", "github.com/otaviozanon"],
    ["email", "mailto:otaviozanonn@icloud.com", "otaviozanonn@icloud.com"],
    ["phone", "tel:+5541997861980", "+55 41 99786-1980"],
  ],

  /* --- footer ------------------------------------------------------------ */
  footer: {
    // tagline: "Front-End Developer · React · Next.js · TypeScript",
    rendered: "rendered client-side, no build step",
  },

  /* --- photo / image ----------------------------------------------------- */
  photoUrl: "",

  /* --- GitHub contributions (optional) ----------------------------------- */
  contributionsUrl: "",

  /* --- fallback data (optional) ------------------------------------------ */
  fallbackData: null,

  /* --- matrix rain ------------------------------------------------------- */
  matrixChars: "01OTAVIOZANON<>/{}[]#*",
};
