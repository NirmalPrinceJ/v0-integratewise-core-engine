/**
 * Twin Memory & Persistence Types
 * Manages Twin working memory, session logs, and audit trails
 */

export enum MemoryScope {
  SESSION = "session", // Conversation turn memory
  WORKING = "working", // Twin's current context
  LONG_TERM = "long_term", // Persisted learnings
  ORGANIZATIONAL = "organizational", // Shared institutional knowledge
}

export interface MemoryEntry {
  id: string;
  scope: MemoryScope;
  entity_type: string; // Account, Deal, Person, Task, etc.
  entity_id: string;
  key: string; // Memory identifier
  value: Record<string, any>;
  confidence?: number; // 0-1 confidence score
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  tags?: string[];
}

export interface SessionLog {
  id: string;
  session_id: string;
  user_id: string;
  twin_id: string;
  start_time: Date;
  end_time?: Date;
  duration_ms?: number;
  turns: ConversationTurn[];
  context_summary?: string;
  decisions_made?: string[];
  actions_taken?: string[];
  status: "active" | "completed" | "interrupted";
}

export interface ConversationTurn {
  id: string;
  turn_number: number;
  timestamp: Date;
  message: string;
  sender: "user" | "twin";
  context?: Record<string, any>;
  tool_calls?: ToolCall[];
  result?: string;
  reasoning?: string;
}

export interface ToolCall {
  id: string;
  tool_name: string;
  arguments: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
  duration_ms?: number;
  timestamp: Date;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  actor: string; // user_id or twin_id
  action: string;
  resource_type: string;
  resource_id: string;
  change_type: "create" | "read" | "update" | "delete" | "execute";
  changes?: Record<string, { old: any; new: any }>;
  authority_level: "user" | "manager" | "executive" | "system";
  approval_status: "pending" | "approved" | "rejected" | "auto_approved";
  approved_by?: string;
  approved_at?: Date;
  notes?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface TwinMemoryStore {
  getMemory(scope: MemoryScope, key: string): Promise<MemoryEntry | undefined>;
  setMemory(scope: MemoryScope, key: string, value: Record<string, any>): Promise<string>;
  updateMemory(id: string, value: Record<string, any>): Promise<boolean>;
  deleteMemory(id: string): Promise<boolean>;
  getMemoriesFor(entityType: string, entityId: string, scope?: MemoryScope): Promise<MemoryEntry[]>;
  searchMemories(query: string, scope?: MemoryScope): Promise<MemoryEntry[]>;
}

export interface SessionLogStore {
  createSession(userId: string, twinId: string): Promise<SessionLog>;
  addTurn(sessionId: string, turn: Omit<ConversationTurn, "id" | "timestamp">): Promise<ConversationTurn>;
  completeSession(sessionId: string): Promise<SessionLog>;
  getSession(sessionId: string): Promise<SessionLog | undefined>;
  getUserSessions(userId: string, limit?: number): Promise<SessionLog[]>;
}

export interface AuditLogStore {
  log(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<string>;
  getLog(id: string): Promise<AuditLogEntry | undefined>;
  getLogs(resourceType: string, resourceId: string): Promise<AuditLogEntry[]>;
  getAuditTrail(userId: string, startDate: Date, endDate: Date): Promise<AuditLogEntry[]>;
  searchLogs(query: string, filters?: Record<string, any>): Promise<AuditLogEntry[]>;
}

export interface TwinMemoryContext {
  memories: Map<string, MemoryEntry>;
  sessions: Map<string, SessionLog>;
  auditLogs: Map<string, AuditLogEntry>;
  preferences: Record<string, any>;
  learned_patterns: Record<string, { frequency: number; last_used: Date }>;
}
