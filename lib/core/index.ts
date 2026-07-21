/**
 * IntegrateWise Core Platform
 * Export all core systems for capability execution and governance
 */

// Capability Registry
export * from "./capability-registry/types";
export { CapabilityRegistryImpl, createDefaultRegistry } from "./capability-registry/registry";

// Capability Engine
export * from "./capability-engine/engine";

// Capability Context
export * from "./capability-context/context-builder";

// Capability Fabric
export * from "./capability-fabric/executor";

// Operating Calendar & Scheduling
export * from "./scheduling";

// Twin Memory & Persistence
export * from "./twin-memory";

// Department Workbenches
export * from "./workbenches";

// Connector & MCP Integration
export * from "./connectors";

// Operational Templates
export * from "./templates";

// Re-export for convenience
export { CapabilityEngine } from "./capability-engine/engine";
export { ContextBuilder } from "./capability-context/context-builder";
export { CapabilityRegistryImpl } from "./capability-registry/registry";
export { CapabilityFabricExecutor } from "./capability-fabric/executor";
export { OperatingCalendarEngine, createDefaultOperatingCalendar } from "./scheduling";
export { TwinMemoryManager } from "./twin-memory";
export { WorkbenchManager } from "./workbenches";
export { ConnectorManager } from "./connectors";
export { TemplateManager, templateManager } from "./templates/manager";
export { getTemplateRegistry } from "./templates/definitions";
