export type ClientIndustry =
  | 'ecommerce'
  | 'saas'
  | 'travel_hospitality'
  | 'finance_fintech'
  | 'lead_generation'
  | 'media_publishing'
  | 'other';

export interface Client {
  id: string;
  name: string;
  slug: string;
  industry: ClientIndustry;
  websiteUrl: string;
  brandColor: string;
  notes?: string;
  createdAt: string;
  experimentCount?: number;
}

export type ExperimentStatus =
  | 'draft'
  | 'active'
  | 'ready_for_prod'
  | 'concluded'
  | 'archived';

export type InjectionPlacement =
  | 'body_start'
  | 'body_end'
  | 'head_end'
  | 'custom_selector';

export type InsertPosition = 'before' | 'after' | 'prepend' | 'append';

export interface Variant {
  id: string;
  name: string;
  isControl: boolean;
  description: string;
  cssCode: string;
  jsCode: string;
  htmlCode: string;
  placement: InjectionPlacement;
  insertPosition: InsertPosition;
  targetSelector?: string;
}

export interface Experiment {
  id: string;
  clientId: string;
  name: string;
  hypothesis: string;
  status: ExperimentStatus;
  targetUrl: string;
  primaryMetric: string;
  secondaryMetrics?: string[];
  activeVariantId: string;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
  tags?: string[];
}

export type SnippetCategory =
  | 'all'
  | 'urgency'
  | 'social_proof'
  | 'friction_reduction'
  | 'sticky_elements'
  | 'cta_value_prop'
  | 'form_opt'
  | 'layout'
  | 'custom';

export interface Snippet {
  id: string;
  title: string;
  description: string;
  category: SnippetCategory;
  tags: string[];
  cssCode: string;
  jsCode: string;
  htmlCode: string;
  targetSelectorHint?: string;
  isDefault?: boolean;
  clientId?: string;
  createdAt: string;
}

export type DeviceViewport = 'desktop' | 'tablet' | 'mobile' | 'responsive';

export type ViewLayoutMode = 'single' | 'split_side_by_side';

export interface ExecutionLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  timestamp: string;
}

export type CodeTab = 'css' | 'js' | 'html' | 'settings' | 'console';

export type ExportFormat =
  | 'vanilla_js'
  | 'optimizely'
  | 'vwo'
  | 'gtm'
  | 'ab_tasty'
  | 'convert';

export interface PageSnapshot {
  id: string;
  name: string;
  originalUrl: string;
  html: string;
  createdAt: string;
  clientId?: string;
  description?: string;
}
