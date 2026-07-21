// Template System Types
// Mirrors Coda template structure but with embedded capabilities and features

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'email' | 'button' | 'calculated';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  formula?: string;
  icon?: string;
}

export interface TemplateAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  trigger: 'button' | 'webhook' | 'schedule' | 'manual';
  capability?: string;
  connector?: string;
  confirmation?: string;
}

export interface TemplateView {
  id: string;
  name: string;
  type: 'table' | 'kanban' | 'timeline' | 'gallery' | 'form' | 'dashboard';
  fields: string[];
  filters?: Array<{ field: string; operator: string; value: string }>;
  groupBy?: string;
  sortBy?: string;
}

export interface TemplateSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: TemplateField[];
  views: TemplateView[];
}

export interface OperationalTemplate {
  id: string;
  name: string;
  description: string;
  department: 'sales' | 'csm' | 'marketing' | 'finance' | 'ops' | 'product' | 'engineering';
  purpose: string;
  icon: string;
  color: string;
  sections: TemplateSection[];
  actions: TemplateAction[];
  integrations: string[];
  shortcodes?: Record<string, string>;
  automations?: Array<{
    id: string;
    trigger: string;
    actions: string[];
  }>;
}

export interface TemplateInstance {
  id: string;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  data: Record<string, any>;
  status: 'draft' | 'active' | 'archived';
}

export interface TemplateRegistry {
  templates: OperationalTemplate[];
  getTemplate(id: string): OperationalTemplate | undefined;
  getTemplatesByDepartment(department: string): OperationalTemplate[];
  searchTemplates(query: string): OperationalTemplate[];
}
