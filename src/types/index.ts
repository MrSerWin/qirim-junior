// Main data types for the application

export interface Poem {
  id: number;
  TitleLat: string;
  TitleCyr: string;
  PoemLat: string;
  PoemCyr: string;
  Author: string;
  Theme: string;
  Image: string;
  ImageToView: string;
  UpdatedAt: string;
  IsDeleted: boolean;
  IsNeedToBeAdded: boolean;
  UniqId: string;
}

export interface Author {
  id: string;
  name: string;
}

export interface Theme {
  id: string;
  name: string;
}

export type Language = 'lat' | 'cyr';

export interface FilterState {
  author: string | null;
  theme: string | null;
  searchQuery: string;
}

export interface AppSettings {
  language: Language;
  lastSync: string | null;
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  PoemDetail: { poemId: number };
};

export type MainTabParamList = {
  PoemsList: undefined;
  About: undefined;
};
