/**
 * Workbench Manager
 * Manages department workbenches, views, and context
 */

import type { DepartmentWorkbench, WorkbenchView, WorkbenchContext, WorkbenchState } from "./types";
import { Department } from "./types";
import { ALL_WORKBENCHES, getWorkbenchForDepartment, getWorkbenchesForRole } from "./configurations";

export class WorkbenchManager {
  private workbenches: Map<string, DepartmentWorkbench> = new Map();
  private userStates: Map<string, WorkbenchState> = new Map();

  constructor() {
    // Initialize all workbenches
    ALL_WORKBENCHES.forEach((wb) => {
      this.workbenches.set(wb.id, wb);
    });
  }

  /**
   * Get workbench by department
   */
  getWorkbenchByDepartment(department: Department): DepartmentWorkbench | undefined {
    return getWorkbenchForDepartment(department);
  }

  /**
   * Get all workbenches for a role
   */
  getWorkbenchesForRole(role: string): DepartmentWorkbench[] {
    return getWorkbenchesForRole(role);
  }

  /**
   * Get workbench by ID
   */
  getWorkbenchById(workbenchId: string): DepartmentWorkbench | undefined {
    return this.workbenches.get(workbenchId);
  }

  /**
   * Get view from workbench
   */
  getView(workbenchId: string, viewId: string): WorkbenchView | undefined {
    const workbench = this.workbenches.get(workbenchId);
    if (!workbench) return undefined;

    return workbench.views.find((v) => v.id === viewId);
  }

  /**
   * Get default view for workbench
   */
  getDefaultView(workbenchId: string): WorkbenchView | undefined {
    const workbench = this.workbenches.get(workbenchId);
    if (!workbench) return undefined;

    return workbench.views.find((v) => v.id === workbench.default_view);
  }

  /**
   * Initialize user workbench state
   */
  initializeUserState(
    userId: string,
    workbenchId: string,
    context: Omit<WorkbenchContext, "user_id">
  ): WorkbenchState | undefined {
    const workbench = this.workbenches.get(workbenchId);
    if (!workbench) return undefined;

    const defaultView = workbench.views.find((v) => v.id === workbench.default_view);
    if (!defaultView) return undefined;

    const state: WorkbenchState = {
      current_view: defaultView,
      filters: context.filters || {},
      data: {},
      loading: false,
    };

    this.userStates.set(userId, state);
    return state;
  }

  /**
   * Get user workbench state
   */
  getUserState(userId: string): WorkbenchState | undefined {
    return this.userStates.get(userId);
  }

  /**
   * Update user state
   */
  updateUserState(userId: string, updates: Partial<WorkbenchState>): WorkbenchState | undefined {
    const state = this.userStates.get(userId);
    if (!state) return undefined;

    const updated = { ...state, ...updates };
    this.userStates.set(userId, updated);
    return updated;
  }

  /**
   * Switch view for user
   */
  switchView(userId: string, workbenchId: string, viewId: string): WorkbenchState | undefined {
    const workbench = this.workbenches.get(workbenchId);
    if (!workbench) return undefined;

    const view = workbench.views.find((v) => v.id === viewId);
    if (!view) return undefined;

    const state = this.userStates.get(userId);
    if (!state) return undefined;

    state.current_view = view;
    this.userStates.set(userId, state);
    return state;
  }

  /**
   * Update filters
   */
  updateFilters(userId: string, filters: Record<string, any>): WorkbenchState | undefined {
    const state = this.userStates.get(userId);
    if (!state) return undefined;

    state.filters = { ...state.filters, ...filters };
    this.userStates.set(userId, state);
    return state;
  }

  /**
   * Check if user can access workbench
   */
  canAccessWorkbench(userId: string, userRole: string, workbenchId: string): boolean {
    const workbench = this.workbenches.get(workbenchId);
    if (!workbench) return false;

    return workbench.roles.includes(userRole);
  }

  /**
   * Check if user can invoke action
   */
  canInvokeAction(userRole: string, workbenchId: string, actionId: string): boolean {
    const workbench = this.workbenches.get(workbenchId);
    if (!workbench) return false;

    const action = workbench.available_actions.find((a) => a.id === actionId);
    if (!action) return false;

    return !action.role_required || action.role_required === userRole;
  }

  /**
   * Get available capabilities for workbench
   */
  getAvailableCapabilities(workbenchId: string): string[] {
    const workbench = this.workbenches.get(workbenchId);
    if (!workbench) return [];

    return workbench.default_capabilities;
  }

  /**
   * Get workbench metrics
   */
  getWorkbenchMetrics(workbenchId: string) {
    const workbench = this.workbenches.get(workbenchId);
    if (!workbench) return null;

    const activeUsers = Array.from(this.userStates.values()).filter(
      (state) => state.current_view
    ).length;

    return {
      department: workbench.department,
      total_views: workbench.views.length,
      active_users: activeUsers,
      available_capabilities: workbench.default_capabilities.length,
      available_actions: workbench.available_actions.length,
      roles: workbench.roles,
    };
  }

  /**
   * Get all workbench summaries
   */
  getAllWorkbenches() {
    return Array.from(this.workbenches.values()).map((wb) => ({
      id: wb.id,
      department: wb.department,
      title: wb.title,
      description: wb.description,
      icon: wb.icon,
      color: wb.color,
      roles: wb.roles,
      default_capabilities: wb.default_capabilities.length,
    }));
  }
}

export default WorkbenchManager;
