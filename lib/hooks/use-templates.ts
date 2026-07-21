'use client';

import { useState, useCallback } from 'react';
import { templateManager } from '@/lib/core/templates/manager';
import type { OperationalTemplate, TemplateInstance } from '@/lib/core/templates/types';

export function useTemplates() {
  const [instances, setInstances] = useState<TemplateInstance[]>([]);
  const [loading, setLoading] = useState(false);

  // Get all templates
  const getAllTemplates = useCallback((): OperationalTemplate[] => {
    return templateManager.getAllTemplates();
  }, []);

  // Get templates by department
  const getTemplatesByDepartment = useCallback((department: string): OperationalTemplate[] => {
    return templateManager.getTemplatesByDepartment(department);
  }, []);

  // Search templates
  const searchTemplates = useCallback((query: string): OperationalTemplate[] => {
    return templateManager.searchTemplates(query);
  }, []);

  // Get template by ID
  const getTemplate = useCallback((id: string): OperationalTemplate | undefined => {
    return templateManager.getTemplate(id);
  }, []);

  // Create new instance
  const createInstance = useCallback(
    (templateId: string, userId: string = 'user-1', initialData = {}) => {
      setLoading(true);
      try {
        const instance = templateManager.createInstance(templateId, userId, initialData);
        if (instance) {
          setInstances(prev => [...prev, instance]);
          return instance;
        }
      } finally {
        setLoading(false);
      }
      return null;
    },
    []
  );

  // Update instance
  const updateInstance = useCallback((instanceId: string, updates: Record<string, any>) => {
    setLoading(true);
    try {
      const updated = templateManager.updateInstance(instanceId, updates);
      if (updated) {
        setInstances(prev =>
          prev.map(i => (i.id === instanceId ? updated : i))
        );
        return updated;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Activate instance
  const activateInstance = useCallback((instanceId: string) => {
    setLoading(true);
    try {
      const activated = templateManager.activateInstance(instanceId);
      if (activated) {
        setInstances(prev =>
          prev.map(i => (i.id === instanceId ? activated : i))
        );
        return activated;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Archive instance
  const archiveInstance = useCallback((instanceId: string) => {
    setLoading(true);
    try {
      const archived = templateManager.archiveInstance(instanceId);
      if (archived) {
        setInstances(prev =>
          prev.map(i => (i.id === instanceId ? archived : i))
        );
        return archived;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Execute action
  const executeAction = useCallback(
    async (templateId: string, instanceId: string, actionId: string, context = {}) => {
      setLoading(true);
      try {
        const result = await templateManager.executeAction(
          templateId,
          instanceId,
          actionId,
          context
        );
        return result;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get active instances for template
  const getActiveInstances = useCallback((templateId: string) => {
    return templateManager.getInstancesByTemplate(templateId);
  }, []);

  // Get dashboard data
  const getDashboardData = useCallback((department: string) => {
    return templateManager.getDashboardData(department);
  }, []);

  return {
    templates: getAllTemplates(),
    instances,
    loading,
    getAllTemplates,
    getTemplatesByDepartment,
    searchTemplates,
    getTemplate,
    createInstance,
    updateInstance,
    activateInstance,
    archiveInstance,
    executeAction,
    getActiveInstances,
    getDashboardData,
  };
}
