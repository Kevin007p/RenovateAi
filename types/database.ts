export type RenovationType = 'kitchen' | 'basement' | 'bathroom' | 'garden' | 'roof' | 'other';
export type InterestLevel = 'interested' | 'thinking' | 'not_interested';

export interface RenovationProject {
  id: string;
  renovation_type: RenovationType;
  initial_prompt: string;
  min_price?: number;
  max_price?: number;
  interest_level: InterestLevel;
  estimated_timeline?: string;
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  created_at: string;
} 