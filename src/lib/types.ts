
export type Big5Trait = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
export type Big5Level = 'High' | 'Mid' | 'Low';
export type EQTrait = 'awareness' | 'regulation' | 'motivation' | 'empathy' | 'social';

export interface Big5State {
    [key: string]: Big5Level | '';
}

export interface EQState {
    awareness: Big5Level | '';
    regulation: Big5Level | '';
    motivation: Big5Level | '';
    empathy: Big5Level | '';
    social: Big5Level | '';
}

export interface Inputs {
    enneagram: string;
    big5: Big5State;
    anchor: string;
    via: string[];
    eq: EQState;
}

export interface ArchetypeDNA {
    how: string;
    what: string;
    why: string;
}

export interface ArchetypePartner {
    role: string;
    reason: string;
}

export interface GrowthDetail {
    title: string;
    description: string;
    actionItems: string[];
}

export interface GrowthGuide {
    discipline: GrowthDetail;
    skill: GrowthDetail;
    leadership: GrowthDetail;
    relationship: GrowthDetail;
    model: {
        name: string;
        desc: string;
        lesson: string;
    };
    checklist: string[];
    education: string;
}

export interface RoleModel {
    name: string;
    epithet: string;
    description: string;
    connection: string;
    bibleVerse: string;
    leadershipStyle: string;
    lesson: string;
}

export interface ArchetypeSubType {
    title: string;
    catchphrase: string;
    description: string;
    keyFocus: string;
    symbol: string;
    strength: string;
    risk: string;
}

export interface SimulationData {
    deskAtmosphere: string;
    dailyRoutine: string;
    meetingStyle: string;
    reportingStyle: string;
    communicationStyle: string;
    crisisReaction: string;
    energySource: string;
    stressTrigger: string;
    decisionProcess: string;
    emailTone: string;
}

export interface WeeklyPlan {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
}

export interface ConflictScenario {
    situation: string;
    wrongResponse: string;
    rightResponse: string;
    principle: string;
}

export interface PracticalTip {
    category: string;
    title: string;
    description: string;
    doList: string[];
    dontList: string[];
}

export interface PrayerGuide {
    morningPrayer: string;
    noonPrayer: string;
    eveningReflection: string;
    specialPrayer: string;
    weeklyFocus: string[];
}

export interface PlacementPrinciple {
    title: string;
    description: string;
    basis: string; // 근거 (회의록, 규정 등)
}

export interface OnboardingStep {
    phase: string;
    period: string;
    tasks: string[];
    mentor: string;
}

export interface CLARequirement {
    required: boolean;
    exemptionCondition?: string;
    alternativePrograms?: string[];
    minimumPeriod: string;
}

export interface DISCProfile {
    primaryType: string;
    description: string;
    fitReason: string;
}

export interface SalaryStructure {
    grade: string;
    centralSupport: boolean;
    note: string;
}

export interface GenderSupportPolicy {
    maternityLeave: string;
    substituteArrangement: string;
    coupleMinistryOption: string;
    additionalSupport: string[];
}

export interface DeploymentFit {
    hqScore: number;
    fieldScore: number;
    idealDepartments: string[];
    reasoning: string;
    warningPlacements: string[];
    placementPrinciples: PlacementPrinciple[];
    discProfile: DISCProfile;
    claRequirement: CLARequirement;
    onboardingSteps: OnboardingStep[];
    salaryStructure: SalaryStructure;
    genderSupport: GenderSupportPolicy;
    centralHiringNote: string;
    hrRecommendation: string;
}

export interface KPITemplate {
    quantitative: { name: string; weight: number; description: string }[];
    providential: { name: string; weight: number; description: string }[];
    growth: { name: string; weight: number; description: string }[];
    evaluationTip: string;
}

export interface CareerRoadmapStage {
    stage: string;
    period: string;
    focus: string;
    tasks: string[];
    risk: string;
}

export interface CareerRoadmap {
    stages: CareerRoadmapStage[];
    retirementVision: string;
}

export interface Archetype {
    id: number;
    title: string;
    engTitle: string;
    subtitle: string;
    verse: string;
    traits: {
        big5: Big5Trait;
        enneagram: string[];
        anchor: string[];
        via: string[];
    };
    summary: string;
    details: {
        guide: string;
        synergy: { good: string; bad: string };
        caution: string;
        development: string;
    };
    recommendations: {
        hq: string[];
        field: string[];
    };
    growthGuide: GrowthGuide;
    roleModel: RoleModel;
    roles: string[];
    subTypes: ArchetypeSubType[];
    symbol: string;
    score?: number;
    dna: ArchetypeDNA;
    synergyDesc: string;
    partners: {
        best: ArchetypePartner;
        caution: ArchetypePartner;
    };
    prediction: string;
    activities: string[];
    simulation: SimulationData;
    weeklyPlan: WeeklyPlan;
    conflictScenarios: ConflictScenario[];
    practicalTips: PracticalTip[];
    prayerGuide: PrayerGuide;
    mottoQuotes: string[];
    deploymentFit: DeploymentFit;
    kpiTemplate: KPITemplate;
    careerRoadmap: CareerRoadmap;
}

export interface SavedTeam {
    id: string;
    name: string;
    myArchetypeId: number;
    partnerIds: number[];
    createdAt: number;
}

export interface SavedAnalysis {
    id: string;
    name: string;
    inputs: Inputs;
    resultTitle: string;
    createdAt: number;
}

export interface ExternalTest {
    id: string;
    name: string;
    desc: string;
    detail: string;
    url: string;
    icon: string;
    color: string;
    measurement: string;
    understanding: string;
    utilization: string;
}

export interface ManagementProfile {
    archetypeId: number;
    mintzberg: { roles: string[]; description: string };
    belbin: { roles: string[]; description: string };
    quinn: { roles: string[]; quadrant: string; description: string };
    mcclelland: { dominantNeed: string; description: string };
    historicalModel: { name: string; period: string; description: string; connection: string };
}

export interface RecommendedTest {
    id: string;
    name: string;
    desc: string;
    url: string;
    icon: string;
    color: string;
    tag: string;
}

export interface BenefitItem {
    icon: string;
    title: string;
    desc: string;
}

export interface DetailInfo {
    label?: string;
    name?: string;
    desc: string;
    advice?: string;
    high?: string;
    low?: string;
    fit?: string;
}

export interface EQTraitInfo {
    name: string;
    desc: string;
    high: string;
    low: string;
    fit: string;
}

export interface DetailData {
    enneagram: Record<string, DetailInfo>;
    big5: Record<string, DetailInfo>;
    anchor: Record<string, DetailInfo>;
    via: { desc: string; list?: string[] };
    eq: Record<string, EQTraitInfo>;
}
