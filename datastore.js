import { z } from 'zod';

/**
 * APPLICATION ENUMS & CONSTANTS
 */
export const AppState = {
  LANDING: 'LANDING',
  IDLE: 'IDLE',
  ANALYSING: 'ANALYSING',
  RESULTS: 'RESULTS',
  GENERATING_CV: 'GENERATING_CV',
  CV_VIEW: 'CV_VIEW',
  RECOMMENDING_CAREERS: 'RECOMMENDING_CAREERS',
  CAREER_SUGGESTIONS: 'CAREER_SUGGESTIONS',
  RECRUITER_PORTAL: 'RECRUITER_PORTAL',
  ERROR: 'ERROR'
};

export const JourneyStage = {
  PROFILE: 0,
  ANALYSIS: 1,
  LEARNING: 2,
  CV_UPDATE: 3,
  JOB_READY: 4,
  PLACED: 5
};

export const PricingTier = {
  STARTER: 'Starter',
  PRO: 'Pro',
  ELITE: 'Elite'
};

export const CandidateCategory = {
  ASPIRING: 'ASPIRING',
  PROFESSIONAL: 'PROFESSIONAL',
  EXECUTIVE: 'EXECUTIVE',
  JOB_READY: 'JOB_READY'
};

export const HistoryType = {
  ANALYSIS: 'ANALYSIS',
  GENERATED_CV: 'GENERATED_CV',
  UCAS_GUIDANCE: 'UCAS_GUIDANCE'
};

/**
 * REGIONAL PRICING CONFIGURATION
 */
export const REGIONAL_PRICES = {
  India: { symbol: '₹', l: '3,999', a: '7,999', p: '12,999', l_val: 3999, a_val: 7999, p_val: 12999 },
  Europe: { symbol: '€', l: '45', a: '89', p: '145', l_val: 45, a_val: 89, p_val: 145 },
  UK: { symbol: '£', l: '39', a: '79', p: '129', l_val: 39, a_val: 79, p_val: 129 },
  Canada: { symbol: 'C$', l: '59', a: '119', p: '189', l_val: 59, a_val: 119, p_val: 189 },
  USA: { symbol: '$', l: '49', a: '99', p: '159', l_val: 49, a_val: 99, p_val: 159 },
  Global: { symbol: '$', l: '49', a: '99', p: '159', l_val: 49, a_val: 99, p_val: 159 }
};

export const getTierPrices = (region = 'UK') => {
  const data = REGIONAL_PRICES[region] || REGIONAL_PRICES.Global;
  return {
    symbol: data.symbol,
    l: `${data.symbol}${data.l}`,
    a: `${data.symbol}${data.a}`,
    p: `${data.symbol}${data.p}`,
    l_val: data.l_val,
    a_val: data.a_val,
    p_val: data.p_val
  };
};

/**
 * PRICING PLANS CONFIGURATION
 */
export const getPricingPlans = (prices) => [
  {
    tier: PricingTier.STARTER,
    price: prices.l,
    description: 'Foundational career tools',
    features: ['CV scan', 'Core gaps', 'Course picks', 'Simple layout', 'Pay overview', 'Uni draft'],
    highlight: false,
    buttonText: 'Select starter'
  },
  {
    tier: PricingTier.PRO,
    price: prices.a,
    description: 'The professional standard',
    features: ['Full review', 'Skill map', 'Course library', 'Modern layout', 'Local insights', 'Interview prep'],
    highlight: true,
    buttonText: 'Select pro'
  },
  {
    tier: PricingTier.ELITE,
    price: prices.p,
    description: 'Executive leadership focus',
    features: ['Exec audit', 'Mastery map', 'Certified paths', 'Premium layout', 'UK insights', 'Career coach'],
    highlight: false,
    buttonText: 'Select elite'
  }
];

/**
 * UI & CONTENT CONSTANTS
 */
export const PLATFORM_VALUES = [
  { t: 'Strategic AI', d: 'Advanced neurological coaching models designed specifically for executive career goals.' },
  { t: 'Gap Analysis', d: 'Identify precise industry-level skill deficiencies and bridge them with certified training.' },
  { t: 'Placement Focus', d: 'A persistent career partner tracking your progress from profile to senior placement.' }
];

export const PRICING_CRITERIA = [
  'Analysis level',
  'Growth tracking',
  'Learning path',
  'CV blueprint',
  'Market insight',
  'Expert module'
];

export const TRUST_INDICATORS = [
  { label: 'Global standards' },
  { label: 'Career privacy secure' },
  { label: 'AI verified' }
];

export const RECRUITER_NAV_ITEMS = [
  { id: 'REGISTRY', label: 'Talent Registry' },
  { id: 'CLIENTS', label: 'Clients & Placements' },
  { id: 'MANDATES', label: 'Matching Engine' },
  { id: 'CPD', label: 'CPD Analytics' }
];

export const ROLES = [
  "Senior Software Engineer",
  "Product Marketing Manager",
  "Business Development Director",
  "Full Stack Developer",
  "Data Scientist",
  "UX/UI Lead"
];

/**
 * ZOD STORAGE SCHEMAS
 */
export const CandidateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  contact: z.string().email(),
  password: z.string().min(4).optional(),
  location: z.string().default('Remote'),
  qualification: z.string().default('N/A'),
  careerAspirations: z.string(),
  candidateCategory: z.string().default(CandidateCategory.ASPIRING),
  selectedTier: z.string().default(PricingTier.STARTER),
  region: z.string().default('UK'),
  cvAttemptsUsed: z.number().default(0),
  lastPaymentDate: z.number().default(0),
  currentStage: z.number().default(JourneyStage.PROFILE),
  totalCpdHours: z.number().default(0),
  lastAnalysis: z.any().optional(),
  ucasStatement: z.any().optional(),
  placedWithClientId: z.string().optional(),
  placementDate: z.number().optional(),
  createdAt: z.number().default(() => Date.now()),
  updatedAt: z.number().default(() => Date.now()),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  workHistoryText: z.string().optional(),
  targetIndustry: z.string().optional(),
  educationLevel: z.string().optional()
});

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string(),
  region: z.string(),
  activeMandates: z.array(z.any()).default([]),
  totalBusinessBrought: z.number().default(0),
  placementsCount: z.number().default(0)
});