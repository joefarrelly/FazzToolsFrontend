export type PageType = 'gear' | 'profession';

export type AltRow = (string | number)[];

export interface MountItem {
  name: string;
  icon: string;
}

export interface PetItem {
  name: string;
  icon: string;
  link: string;
}

export interface CollectionData {
  collected_count: number;
  total_count: number;
  collected: MountItem[] | PetItem[];
  uncollected: MountItem[] | PetItem[];
}

export type CollectionEntry = [string, CollectionData];

export type MaterialItem = [string, number, string, string]; // [name, qty, icon, quality]
export type RecipeData = [string, boolean, number, number, string, ...MaterialItem[]];
export type CategoryData = [string, RecipeData[]];
export type TierData = [string, CategoryData[]];

export interface AchievementEntry {
  alt: number;
  alt_name: string;
  achievement: number;
  achievement_name: string;
  achievement_points: number;
  achievement_category: string;
  completed_timestamp: number | null;
}

export interface ReputationEntry {
  alt: number;
  alt_name: string;
  faction: number;
  faction_name: string;
  faction_category: string;
  standing_type: string;
  standing_value: number;
}
