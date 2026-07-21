import type { OperationalTemplate, TemplateInstance } from './types';
import { getTemplateRegistry } from './definitions';

export class TemplateManager {
  private registry = getTemplateRegistry();
  private instances: Map<string, TemplateInstance> = new Map();

  constructor() {}

  // Get template by ID
  getTemplate(id: string): OperationalTemplate | undefined {
    return this.registry.getTemplate(id);
  }

  // Get all templates
  getAllTemplates(): OperationalTemplate[] {
    return this.registry.templates;
  }

  // Get templates by department
  getTemplatesByDepartment(department: string): OperationalTemplate[] {
    return this.registry.getTemplatesByDepartment(department);
  }

  // Search templates
  searchTemplates(query: string): OperationalTemplate[] {
    return this.registry.searchTemplates(query);
  }

  // Create new instance from template
  createInstance(
    templateId: string,
    userId: string,
    initialData: Record<string, any> = {}
  ): TemplateInstance | null {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    const instance: TemplateInstance = {
      id: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      data: initialData,
      status: 'draft',
    };

    this.instances.set(instance.id, instance);
    return instance;
  }

  // Get instance
  getInstance(instanceId: string): TemplateInstance | undefined {
    return this.instances.get(instanceId);
  }

  // Update instance
  updateInstance(
    instanceId: string,
    updates: Partial<Record<string, any>>
  ): TemplateInstance | null {
    const instance = this.getInstance(instanceId);
    if (!instance) return null;

    instance.data = { ...instance.data, ...updates };
    instance.updatedAt = new Date();
    return instance;
  }

  // Activate instance
  activateInstance(instanceId: string): TemplateInstance | null {
    const instance = this.getInstance(instanceId);
    if (!instance) return null;

    instance.status = 'active';
    instance.updatedAt = new Date();
    return instance;
  }

  // Archive instance
  archiveInstance(instanceId: string): TemplateInstance | null {
    const instance = this.getInstance(instanceId);
    if (!instance) return null;

    instance.status = 'archived';
    instance.updatedAt = new Date();
    return instance;
  }

  // Get all instances for a template
  getInstancesByTemplate(templateId: string): TemplateInstance[] {
    return Array.from(this.instances.values()).filter(
      i => i.templateId === templateId && i.status !== 'archived'
    );
  }

  // Get all active instances
  getActiveInstances(): TemplateInstance[] {
    return Array.from(this.instances.values()).filter(i => i.status === 'active');
  }

  // Get template field by ID from section
  getTemplateField(templateId: string, sectionId: string, fieldId: string) {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    const section = template.sections.find(s => s.id === sectionId);
    if (!section) return null;

    return section.fields.find(f => f.id === fieldId) || null;
  }

  // Get template actions
  getTemplateActions(templateId: string) {
    const template = this.getTemplate(templateId);
    return template?.actions || [];
  }

  // Execute template action
  async executeAction(
    templateId: string,
    instanceId: string,
    actionId: string,
    context: Record<string, any> = {}
  ) {
    const template = this.getTemplate(templateId);
    const instance = this.getInstance(instanceId);

    if (!template || !instance) {
      return { success: false, error: 'Template or instance not found' };
    }

    const action = template.actions.find(a => a.id === actionId);
    if (!action) {
      return { success: false, error: 'Action not found' };
    }

    // Prepare context
    const executionContext = {
      ...context,
      template,
      instance,
      action,
      data: instance.data,
    };

    // Log action execution
    console.log(`[Template Action] ${action.name} on ${template.name}`, executionContext);

    try {
      // Action execution would typically:
      // 1. Trigger capability engine for AI actions
      // 2. Call connectors for external integrations
      // 3. Execute automations
      // 4. Update instance state

      return {
        success: true,
        action: action.name,
        result: 'Action executed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get dashboard data for department
  getDashboardData(department: string) {
    const templates = this.getTemplatesByDepartment(department);
    const instances = templates.flatMap(t =>
      this.getInstancesByTemplate(t.id)
    );

    return {
      department,
      templates: templates.length,
      activeInstances: instances.filter(i => i.status === 'active').length,
      totalInstances: instances.length,
      templates: templates.map(t => ({
        id: t.id,
        name: t.name,
        icon: t.icon,
        instances: this.getInstancesByTemplate(t.id).length,
      })),
    };
  }
}

export const templateManager = new TemplateManager();
