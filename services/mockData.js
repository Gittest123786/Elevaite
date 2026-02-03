
import { PricingTier } from "../app/types.js";

const ROLES = [
  "Senior Software Engineer",
  "Product Marketing Manager",
  "Business Development Director",
  "Full Stack Developer",
  "Data Scientist",
  "UX/UI Lead"
];

export const getMockTailoredCV = (user, tier) => {
  const role = user.careerAspirations || "Professional";
  const baseCV = {
    personalInfo: {
      name: user.name || "Alex Chen",
      contact: user.contact || "alex.chen@example.com",
      location: user.location || "London, UK",
    },
    professionalSummary: `Dynamic and results-driven ${role} with over 5 years of experience in high-growth environments. Expert in strategic planning, cross-functional leadership, and delivering complex projects aligned with global business objectives. Recognized for a data-driven approach and a commitment to continuous professional growth through elevAIte's intelligence paths.`,
    experience: [
      {
        role: `Lead ${role}`,
        company: "Innovate Global",
        duration: "2021 - Present",
        achievements: [
          "Spearheaded a cross-functional team of 15 to deliver 3 flagship products 2 months ahead of schedule.",
          "Increased operational efficiency by 25% through the implementation of AI-driven workflow optimizations.",
          "Managed a $2M annual budget with a 15% reduction in overhead costs while maintaining output quality."
        ],
      },
      {
        role: `Associate ${role}`,
        company: "Market Dynamics Ltd",
        duration: "2018 - 2021",
        achievements: [
          "Developed core strategic frameworks adopted by the entire regional division.",
          "Collaborated with executive stakeholders to define long-term growth roadmaps.",
          "Awarded 'Employee of the Year' for exceptional contributions to team culture and performance."
        ],
      }
    ],
    education: [{ 
      degree: user.qualification || "Master of Science in Strategic Management", 
      institution: "Imperial College London", 
      year: "2016 - 2018" 
    }],
    skills: ["Strategic Planning", "Team Leadership", "Data Analysis", "Project Management", "Agile Methodology", "Cross-functional Collaboration", "AI Integration"],
    templateId: tier
  };
  return baseCV;
};

export const getMockMarketInsights = (careerGoal, region = 'UK') => {
    const currency = { UK: '£', USA: '$', Europe: '€', India: '₹', Canada: 'C$', Global: '$' }[region] || '$';
    const baseSalaries = { 'UK': 55000, 'USA': 110000, 'Europe': 65000, 'India': 2500000, 'Canada': 95000, 'Global': 80000 };
    const base = baseSalaries[region] || 70000;
    
    const format = (num) => {
        if (region === 'India') return `${currency}${Math.round(num).toLocaleString()}`;
        return `${currency}${Math.round(num/1000)}k`;
    };

    const competition = Math.random() > 0.6 ? 'High' : 'Medium';

    return {
        competitionLevel: competition,
        competitionDescription: `The market for ${careerGoal} in ${region} is currently ${competition.toLowerCase()}. Companies are prioritizing candidates with demonstrated AI literacy and a history of self-directed professional development. Strategic relocation or remote flexibility is seeing a 20% premium in this sector.`,
        demandTrend: Math.random() > 0.3 ? 'Rising' : 'Stable',
        demandTrendDescription: 'Monthly job openings in this sector have grown by 12% over the last quarter, driven by digital transformation initiatives.',
        topSkills: [
          { name: 'AI Implementation', demand: 92 },
          { name: 'Strategic Leadership', demand: 85 },
          { name: 'Remote Team Management', demand: 78 },
          { name: 'Data Visualisation', demand: 72 }
        ],
        salaryRange: { 
            min: format(base * 0.85), 
            max: format(base * 1.5), 
            avg: format(base * 1.15) 
        },
        jobListings: [
            { 
                title: `Senior ${careerGoal}`, 
                company: "TechNexus Global", 
                location: `${region} (Hybrid)`, 
                salaryRange: `${format(base * 1.1)} - ${format(base * 1.4)}`, 
                platform: "LinkedIn", 
                url: "https://linkedin.com/jobs" 
            },
            { 
                title: `${careerGoal} Lead`, 
                company: "Fortress Financials", 
                location: `Remote`, 
                salaryRange: `${format(base * 1.3)} - ${format(base * 1.6)}`, 
                platform: "Indeed", 
                url: "https://indeed.com" 
            },
            { 
                title: `Head of ${careerGoal}`, 
                company: "Starlight VC", 
                location: `Major City Hub`, 
                salaryRange: `${format(base * 1.6)} - ${format(base * 2.2)}`, 
                platform: "Glassdoor", 
                url: "https://glassdoor.com" 
            }
        ]
    };
};
