import { LucideIcon } from 'lucide-react';

export interface RoleFeature {
  icon: LucideIcon;
  title: string;
  points: string[];
}

export interface ComparisonItem {
  company: string;
  achievement: string;
  method: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ChatMessage {
  sender: 'Founder' | 'System' | 'Producer' | 'Marketer';
  text: string;
  time: string;
}

export interface FormData {
  role: string;
  telegram: string;
  consent: boolean;
}

// New Types for Split Screen Comparison
export interface StageData {
  title: string;
  description: string;
  result: string;
  time: string;
}

export interface PathData {
  stages: StageData[];
  totalTime: string;
  summary: string;
}

export interface RoleComparisonData {
  roleId: string; // 'founder' | 'marketer' | 'influencer'
  roleName: string;
  kultPath: PathData;
  tradPath: PathData;
}