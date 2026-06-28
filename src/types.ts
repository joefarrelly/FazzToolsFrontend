export type PageType = 'kb' | 'gear' | 'profession';

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

// [title, rows] where each row is [spell, bind]
export type KeybindEntry = [string, string[][]];

export type MaterialItem = [string, number, string, string]; // [name, qty, icon, quality]
export type RecipeData = [string, boolean, number, number, string, ...MaterialItem[]];
export type CategoryData = [string, RecipeData[]];
export type TierData = [string, CategoryData[]];
