import { Filter, Sort } from "../types";

// Base configuration type
export interface SduiBaseConfig {
  id: string;
  label: string;
}

// Generic option type
export interface SduiOption<T = any> {
  label: string;
  value: T;
}

// Specific configuration types
export interface SduiFilterConfig extends SduiBaseConfig {
  options: SduiOption[];
  filters: Filter[];
  sorts: Sort[];
}

export interface SduiComponentConfig extends SduiBaseConfig {
  componentType: string;
  props: Record<string, any>;
}

export interface SduiLayoutConfig extends SduiBaseConfig {
  layoutType: string;
  children: SduiConfig[];
}

// Union type for all possible configurations
export type SduiConfig = SduiFilterConfig | SduiComponentConfig | SduiLayoutConfig;

// Response type
export type SduiConfigResponse<T = SduiConfig> = T[]; 