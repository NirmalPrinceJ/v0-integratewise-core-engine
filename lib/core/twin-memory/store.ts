/**
 * Twin Memory Store Implementation
 * In-memory implementation with persistence hooks
 * Production: Replace with Supabase or database backend
 */

import type {
  MemoryEntry,
  MemoryScope,
  SessionLog,
  ConversationTurn,
  AuditLogEntry,
  TwinMemoryStore,
  SessionLogStore,
  AuditLogStore,
  TwinMemoryContext,
} from "./types";

/**
 * In-Memory Memory Store (for development)
 */
export class InMemoryMemoryStore implements TwinMemoryStore {
  private memories: Map<string, MemoryEntry> = new Map();
  private idCounter = 0;

  async getMemory(scope: MemoryScope, key: string): Promise<MemoryEntry | undefined> {
    const entries = Array.from(this.memories.values());
    return entries.find((e) => e.scope === scope && e.key === key);
  }

  async setMemory(scope: MemoryScope, key: string, value: Record<string, any>): Promise<string> {
    const id = `mem_${++this.idCounter}`;
    const entry: MemoryEntry = {
      id,
      scope,
      entity_type: value.entity_type || "unknown",
      entity_id: value.entity_id || "unknown",
      key,
      value,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.memories.set(id, entry);
    return id;
  }

  async updateMemory(id: string, value: Record<string, any>): Promise<boolean> {
    const entry = this.memories.get(id);
    if (!entry) return false;

    entry.value = { ...entry.value, ...value };
    entry.updated_at = new Date();
    this.memories.set(id, entry);
    return true;
  }

  async deleteMemory(id: string): Promise<boolean> {
    return this.memories.delete(id);
  }

  async getMemoriesFor(
    entityType: string,
    entityId: string,
    scope?: MemoryScope
  ): Promise<MemoryEntry[]> {
    const entries = Array.from(this.memories.values());
    return entries.filter(
      (e) =>
        e.entity_type === entityType &&
        e.entity_id === entityId &&
        (!scope || e.scope === scope)
    );
  }

  async searchMemories(query: string, scope?: MemoryScope): Promise<MemoryEntry[]> {
    const entries = Array.from(this.memories.values());
    const lowerQuery = query.toLowerCase();

    return entries.filter(
      (e) =>
        (e.key.toLowerCase().includes(lowerQuery) ||
          JSON.stringify(e.value).toLowerCase().includes(lowerQuery)) &&
        (!scope || e.scope === scope)
    );
  }
}

/**
 * In-Memory Session Log Store (for development)
 */
export class InMemorySessionLogStore implements SessionLogStore {
  private sessions: Map<string, SessionLog> = new Map();
  private sessionIdCounter = 0;

  async createSession(userId: string, twinId: string): Promise<SessionLog> {
    const sessionId = `session_${++this.sessionIdCounter}`;
    const session: SessionLog = {
      id: sessionId,
      session_id: sessionId,
      user_id: userId,
      twin_id: twinId,
      start_time: new Date(),
      turns: [],
      status: "active",
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  async addTurn(
    sessionId: string,
    turn: Omit<ConversationTurn, "id" | "timestamp">
  ): Promise<ConversationTurn> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Session not found");

    const turnId = `turn_${Date.now()}_${Math.random()}`;
    const newTurn: ConversationTurn = {
      id: turnId,
      timestamp: new Date(),
      ...turn,
    };

    session.turns.push(newTurn);
    this.sessions.set(sessionId, session);
    return newTurn;
  }

  async completeSession(sessionId: string): Promise<SessionLog> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Session not found");

    session.end_time = new Date();
    session.duration_ms = session.end_time.getTime() - session.start_time.getTime();
    session.status = "completed";

    this.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<SessionLog | undefined> {
    return this.sessions.get(sessionId);
  }

  async getUserSessions(userId: string, limit: number = 10): Promise<SessionLog[]> {
    const sessions = Array.from(this.sessions.values())
      .filter((s) => s.user_id === userId)
      .sort((a, b) => b.start_time.getTime() - a.start_time.getTime())
      .slice(0, limit);

    return sessions;
  }
}

/**
 * In-Memory Audit Log Store (for development)
 */
export class InMemoryAuditLogStore implements AuditLogStore {
  private logs: Map<string, AuditLogEntry> = new Map();
  private idCounter = 0;

  async log(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<string> {
    const id = `audit_${++this.idCounter}`;
    const auditEntry: AuditLogEntry = {
      id,
      timestamp: new Date(),
      ...entry,
    };

    this.logs.set(id, auditEntry);
    return id;
  }

  async getLog(id: string): Promise<AuditLogEntry | undefined> {
    return this.logs.get(id);
  }

  async getLogs(resourceType: string, resourceId: string): Promise<AuditLogEntry[]> {
    const entries = Array.from(this.logs.values());
    return entries
      .filter((e) => e.resource_type === resourceType && e.resource_id === resourceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAuditTrail(userId: string, startDate: Date, endDate: Date): Promise<AuditLogEntry[]> {
    const entries = Array.from(this.logs.values());
    return entries
      .filter(
        (e) =>
          e.actor === userId && e.timestamp >= startDate && e.timestamp <= endDate
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async searchLogs(query: string, filters?: Record<string, any>): Promise<AuditLogEntry[]> {
    const entries = Array.from(this.logs.values());
    const lowerQuery = query.toLowerCase();

    return entries.filter((e) => {
      const matches = e.action.toLowerCase().includes(lowerQuery) ||
        e.resource_type.toLowerCase().includes(lowerQuery) ||
        e.actor.toLowerCase().includes(lowerQuery);

      if (!matches) return false;

      if (filters) {
        if (filters.action && e.action !== filters.action) return false;
        if (filters.resource_type && e.resource_type !== filters.resource_type) return false;
        if (filters.change_type && e.change_type !== filters.change_type) return false;
      }

      return true;
    });
  }
}

/**
 * Twin Memory Context Manager
 */
export class TwinMemoryManager {
  private memoryStore: TwinMemoryStore;
  private sessionStore: SessionLogStore;
  private auditStore: AuditLogStore;
  private context: TwinMemoryContext;

  constructor(
    memoryStore?: TwinMemoryStore,
    sessionStore?: SessionLogStore,
    auditStore?: AuditLogStore
  ) {
    this.memoryStore = memoryStore || new InMemoryMemoryStore();
    this.sessionStore = sessionStore || new InMemorySessionLogStore();
    this.auditStore = auditStore || new InMemoryAuditLogStore();
    this.context = {
      memories: new Map(),
      sessions: new Map(),
      auditLogs: new Map(),
      preferences: {},
      learned_patterns: {},
    };
  }

  /**
   * Create new working session
   */
  async createWorkingSession(userId: string, twinId: string): Promise<SessionLog> {
    return this.sessionStore.createSession(userId, twinId);
  }

  /**
   * Add conversation turn to session
   */
  async addConversationTurn(
    sessionId: string,
    message: string,
    sender: "user" | "twin",
    context?: Record<string, any>
  ): Promise<ConversationTurn> {
    return this.sessionStore.addTurn(sessionId, {
      turn_number: 0,
      message,
      sender,
      context,
    });
  }

  /**
   * Store memory entry
   */
  async storeMemory(
    scope: MemoryScope,
    entityType: string,
    entityId: string,
    key: string,
    value: Record<string, any>
  ): Promise<string> {
    return this.memoryStore.setMemory(scope, key, {
      entity_type: entityType,
      entity_id: entityId,
      ...value,
    });
  }

  /**
   * Retrieve memory
   */
  async getMemory(scope: MemoryScope, key: string): Promise<MemoryEntry | undefined> {
    return this.memoryStore.getMemory(scope, key);
  }

  /**
   * Get entity memories
   */
  async getEntityMemories(
    entityType: string,
    entityId: string,
    scope?: MemoryScope
  ): Promise<MemoryEntry[]> {
    return this.memoryStore.getMemoriesFor(entityType, entityId, scope);
  }

  /**
   * Log audit entry
   */
  async logAudit(
    actor: string,
    action: string,
    resourceType: string,
    resourceId: string,
    changeType: AuditLogEntry["change_type"],
    authorityLevel: AuditLogEntry["authority_level"]
  ): Promise<string> {
    return this.auditStore.log({
      actor,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      change_type: changeType,
      authority_level: authorityLevel,
      approval_status: "auto_approved",
    });
  }

  /**
   * Get audit trail for user
   */
  async getAuditTrail(userId: string, days: number = 30): Promise<AuditLogEntry[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.auditStore.getAuditTrail(userId, startDate, endDate);
  }

  /**
   * Get memory statistics
   */
  async getMemoryStats(): Promise<Record<string, any>> {
    // In production, aggregate from database
    return {
      total_entries: this.context.memories.size,
      sessions_active: Array.from(this.context.sessions.values()).filter((s) => s.status === "active").length,
      audit_entries: this.context.auditLogs.size,
      learned_patterns: Object.keys(this.context.learned_patterns).length,
    };
  }
}

export default TwinMemoryManager;
