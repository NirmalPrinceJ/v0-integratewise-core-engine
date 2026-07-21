# Governance & Continuity Framework


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Built-In System Resilience, Compliance, and Operational Excellence**

## Overview

The IntegrateWise system includes comprehensive Governance and Continuity frameworks that are integrated into every layer of the architecture. These systems ensure compliance, audit trails, state recovery, and disaster readiness.

---

## Table of Contents

1. [Governance Framework](#governance-framework)
2. [Continuity Framework](#continuity-framework)
3. [Integration Points](#integration-points)
4. [Operational Procedures](#operational-procedures)
5. [Compliance & Certifications](#compliance--certifications)

---

## Governance Framework

### Components

#### 1. Audit Logging (services/gateway/src/governance.ts)

**Purpose:** Track all state changes and actions for compliance and investigation.

**Features:**
- Complete audit trail of every operation
- Actor identification (userId, role, email)
- Timestamp and IP tracking
- Resource identification
- Success/failure tracking

**Audit Event Types:**
- `auth_login` / `auth_logout` - authentication events
- `onboarding_start` / `onboarding_complete` - user setup
- `role_change` - role modifications
- `connector_enabled` / `connector_disabled` - connector changes
- `spine_data_sync` - data synchronization
- `ai_chat_message` - AI interactions
- `memory_captured` / `memory_promoted` - memory management
- `data_accessed` / `data_modified` / `data_deleted` - data operations
- `permission_denied` - access control violations
- `backup_created` / `backup_restored` - backup operations

**API Usage:**
```typescript
const auditLogger = governance.getAuditLogger()

await auditLogger.log({
  actor: { userId, role, email },
  action: 'data_accessed',
  resource: { type: 'spine.person', id: '123', name: 'John Doe' },
  details: { fields: ['email', 'phone'] },
  result: 'success',
  ipAddress,
  userAgent,
})

const trail = await auditLogger.getAuditTrail({
  userId,
  action: 'data_accessed',
  startDate: new Date('2024-01-01'),
})

const csv = await auditLogger.exportAuditLog('csv')
```

#### 2. Compliance Checking (services/gateway/src/governance.ts)

**Purpose:** Verify system compliance with regulatory frameworks.

**Supported Frameworks:**
- **SOC2** - System and Organization Controls
- **GDPR** - General Data Protection Regulation
- **CCPA** - California Consumer Privacy Act
- **HIPAA** - Health Insurance Portability and Accountability Act
- **Custom** - Organization-specific policies

**Default Rules:**
- Data Access Audit (critical)
- User Consent Required (critical)
- Data Retention Policy (high)
- Role-Based Access Control (critical)
- Encryption at Rest (critical)

**API Usage:**
```typescript
const complianceChecker = governance.getComplianceChecker()

const { compliant, violations } = await complianceChecker.checkCompliance(auditEvent)

const report = await complianceChecker.generateComplianceReport('soc2')
console.log(`Compliant: ${report.compliantRules}/${report.totalRules}`)
```

#### 3. Change Management (services/gateway/src/governance.ts)

**Purpose:** Control changes through approval workflows.

**Change Types:**
- `feature` - new features
- `bugfix` - bug fixes
- `hotfix` - urgent fixes
- `security` - security patches
- `config` - configuration changes
- `schema` - database schema changes

**Workflow:**
```
Requested → Submitted → Review by 2+ Approvers → Approved → Deployed
                ↓
              Rejected → Request Changes
```

**API Usage:**
```typescript
const changeManager = governance.getChangeManager()

// Request change
const change = await changeManager.requestChange({
  title: 'Add role-based dashboard views',
  description: 'Implement L1 projections for 5 new roles',
  type: 'feature',
  requestedBy: { userId, email },
})

// Approve
await changeManager.approveChange(change.id, 'approver_1', 'Looks good')

// Deploy
await changeManager.deployChange(change.id)

// Rollback if needed
await changeManager.rollbackChange(change.id)
```

#### 4. Data Lineage Tracking (services/gateway/src/governance.ts)

**Purpose:** Track data provenance and quality across connectors.

**Tracks:**
- Source connector
- Destination Spine table
- Field mappings and transformations
- Sync timestamps
- Data quality scores

**Example:**
```
Freshsales
  ├─ contacts → spine.person (99% quality)
  ├─ accounts → spine.organization (98% quality)
  └─ deals → spine.opportunity (97% quality)
```

**API Usage:**
```typescript
const lineageTracker = governance.getDataLineageTracker()

const provenance = await lineageTracker.getDataProvenance('spine.person')
console.log('Upstream sources:', provenance.upstream)

const report = await lineageTracker.generateDataQualityReport()
console.log(`Avg quality: ${report.averageQualityScore}`)
```

---

## Continuity Framework

### Components

#### 1. State Checkpoints (services/gateway/src/continuity.ts)

**Purpose:** Save system state for recovery from failures.

**Checkpoint Reasons:**
- `manual` - admin-triggered
- `scheduled` - periodic checkpoints
- `pre_deployment` - before major changes
- `pre_upgrade` - before system upgrades
- `incident_response` - during troubleshooting

**API Usage:**
```typescript
const stateManager = continuity.getStateManager()

// Register components
stateManager.registerComponent('auth_service')
stateManager.registerComponent('spine_database')

// Update state
stateManager.updateComponentState('auth_service', {
  activeUsers: 1250,
  failedLogins: 3,
})

// Create checkpoint
const checkpoint = await stateManager.createCheckpoint({
  name: 'Pre-deployment snapshot',
  version: 'v2.1.0',
  metadata: {
    createdBy: 'admin@example.com',
    reason: 'pre_deployment',
  },
})

// Restore from checkpoint
await stateManager.restoreFromCheckpoint(checkpoint.id)
```

#### 2. Backup Management (services/gateway/src/continuity.ts)

**Purpose:** Automated backups with verification and retention policies.

**Backup Types:**
- `full` - complete database backup
- `incremental` - changes since last backup
- `differential` - changes since last full backup

**Features:**
- Automated scheduling (hourly, daily, weekly, monthly)
- Retention policies with auto-expiry
- Integrity verification
- Multiple storage backends (S3, R2, etc.)

**API Usage:**
```typescript
const backupManager = continuity.getBackupManager()

// Schedule automated backups
await backupManager.scheduleBackup('spine_database', 'daily')
await backupManager.scheduleBackup('memory_storage', 'daily')

// Create manual backup
const backup = await backupManager.createBackup({
  name: 'Pre-migration backup',
  type: 'full',
  sourceDatabase: 'spine_database',
  location: 's3://backups/2024-01-15',
  retention: {
    keepFor: 90,
    expiresAt: new Date('2024-04-15'),
  },
  metadata: { reason: 'migration' },
})

// Verify backup integrity
const { valid, errors } = await backupManager.verifyBackup(backup.id)

// List backups
const recent = await backupManager.listBackups('spine_database', 10)

// Clean up expired backups
const deleted = await backupManager.deleteExpiredBackups()
```

#### 3. Recovery Management (services/gateway/src/continuity.ts)

**Purpose:** Execute disaster recovery plans with defined RTO/RPO.

**Recovery Scenarios:**
- Data corruption
- Ransomware attack
- Hardware failure
- Software bug
- Regional outage
- Human error

**Terminology:**
- **RTO** (Recovery Time Objective) - target time to restore
- **RPO** (Recovery Point Objective) - max acceptable data loss

**Example Recovery Plans:**

```
Scenario: Data Corruption
├─ RTO: 4 hours
├─ RPO: 15 minutes
├─ Steps:
│  ├─ [1] Stop write operations (5 min)
│  ├─ [2] Identify affected records (10 min)
│  ├─ [3] Restore from backup (30 min, automated)
│  ├─ [4] Verify data integrity (20 min, automated)
│  ├─ [5] Restart write operations (5 min)
│  └─ [6] Monitor for anomalies (ongoing)
└─ Total: ~70 minutes (well within RTO)

Scenario: Regional Outage
├─ RTO: 2 hours
├─ RPO: 5 minutes
├─ Steps:
│  ├─ [1] Detect region failure (AUTOMATED: 30 sec)
│  ├─ [2] Failover to backup region (AUTOMATED: 5 min)
│  ├─ [3] Verify connectivity (5 min)
│  ├─ [4] Update DNS records (MANUAL: 10 min)
│  └─ [5] Notify stakeholders (5 min)
└─ Total: ~25 minutes (well within RTO)
```

**API Usage:**
```typescript
const recoveryManager = continuity.getRecoveryManager()

// Create recovery plan
const plan = await recoveryManager.createRecoveryPlan({
  name: 'Data Corruption Response',
  scenario: 'data_corruption',
  rto: 240, // 4 hours
  rpo: 15, // 15 minutes
  testFrequency: 'monthly',
  steps: [
    {
      order: 1,
      title: 'Stop write operations',
      description: 'Pause all data modifications',
      estimatedTime: 5,
      automated: true,
    },
    {
      order: 2,
      title: 'Identify affected records',
      description: 'Scan for corruption patterns',
      estimatedTime: 10,
      automated: true,
    },
    {
      order: 3,
      title: 'Restore from backup',
      description: 'Restore from latest verified backup',
      estimatedTime: 30,
      automated: true,
      rollback: 'Revert to original backup',
    },
    // ... more steps
  ],
})

// Execute recovery
const result = await recoveryManager.executeRecoveryPlan(plan.id)
console.log(`Recovery completed in ${result.duration} minutes`)
console.log(`Within RTO: ${result.duration <= 240 ? 'YES' : 'NO'}`)

// Test recovery plan
const { passed, issues } = await recoveryManager.testRecoveryPlan(plan.id)
console.log(`Test passed: ${passed}`)
```

#### 4. Health Monitoring (services/gateway/src/continuity.ts)

**Purpose:** Track system health and alert on degradation.

**Monitored Metrics:**
- Uptime (target: 99.9%)
- Response time (target: <500ms)
- Error rate (target: <0.1%)
- Backup status (current, stale, missing)

**Health Statuses:**
- `healthy` - all metrics normal
- `degraded` - some metrics outside targets
- `unhealthy` - critical failures

**API Usage:**
```typescript
const healthMonitor = continuity.getHealthMonitor()

// Check component health
const health = await healthMonitor.checkHealth('spine_database')
console.log(health.status) // 'healthy'

// Get system-wide health
const systemHealth = await healthMonitor.getSystemHealth()
console.log(`Overall: ${systemHealth.overall}`)
console.log(`Alerts: ${systemHealth.alerts}`)

// Example alerts:
// - "spine_database is unhealthy"
// - "mcp_connector has no recent backup"
```

---

## Integration Points

### Integration with Authentication

Every auth event is automatically logged:
```typescript
await governance.captureEvent({
  actor: { userId, role, email },
  action: 'auth_login',
  resource: { type: 'user', id: userId },
  details: { ip: request.ip },
  result: 'success',
})
```

### Integration with Data Access

Every data operation triggers compliance checks:
```typescript
const auditEvent = await governance.getAuditLogger().log(event)
const compliance = await governance.getComplianceChecker().checkCompliance(auditEvent)

if (!compliance.compliant) {
  throw new Error(`Compliance violation: ${compliance.violations[0]}`)
}
```

### Integration with Connectors

Data lineage is tracked automatically:
```typescript
await governance.getDataLineageTracker().trackLineage({
  sourceConnector: 'freshsales',
  destinationSpineTable: 'spine.person',
  fields: [
    { source: 'id', destination: 'contact_id', transformation: 'String' },
    { source: 'email', destination: 'email', transformation: null },
  ],
  lastSync: new Date(),
  recordsProcessed: 1000,
  recordsSuccessful: 998,
  recordsFailed: 2,
  dataQualityScore: 0.998,
})
```

### Integration with Backup Schedule

Backups are automatically created on schedule:
```typescript
// Daily backup at 2 AM UTC
setInterval(async () => {
  await continuity.getBackupManager().createBackup({
    name: `daily_spine_${new Date().toISOString().split('T')[0]}`,
    type: 'full',
    sourceDatabase: 'spine_database',
    location: 's3://backups/daily',
    retention: { keepFor: 30, expiresAt: add(new Date(), { days: 30 }) },
    metadata: { automated: true },
  })
}, 24 * 60 * 60 * 1000)
```

---

## Operational Procedures

### Daily Operations

#### Morning Health Check
```bash
# Check system health
curl GET /api/v1/continuity?type=health

# Expected: all components "healthy"
# If degraded: investigate via /governance logs
```

#### Backup Verification
```bash
# List recent backups
curl GET /api/v1/continuity?type=backups

# Verify latest backup
curl POST /api/v1/continuity \
  -d '{"action": "verify_backup", "backupId": "..."}'

# Expected: "verified" status
```

### Incident Response

#### Step 1: Assess
```bash
# Check health and recent events
curl GET /api/v1/continuity?type=health
curl GET /api/v1/governance?type=audit_trail
```

#### Step 2: Create Checkpoint
```bash
# Save current state
curl POST /api/v1/continuity \
  -d '{
    "action": "create_checkpoint",
    "name": "Incident Response",
    "reason": "incident_response"
  }'
```

#### Step 3: Execute Recovery
```bash
# Run recovery plan
curl POST /api/v1/continuity \
  -d '{
    "action": "execute_recovery",
    "planId": "..."
  }'
```

#### Step 4: Verify
```bash
# Check health after recovery
curl GET /api/v1/continuity?type=health

# Verify data integrity
curl GET /api/v1/governance?type=data_lineage
```

### Scheduled Maintenance

#### Weekly: Backup Rotation
- Delete backups older than retention period
- Verify all recent backups

#### Monthly: Recovery Testing
- Execute each recovery plan
- Document RTO/RPO actual vs target
- Update procedures if needed

#### Quarterly: Compliance Audit
- Generate compliance reports for each framework
- Review audit logs for anomalies
- Test access control policies

---

## Compliance & Certifications

### SOC2 Compliance

**Controls Implemented:**
- CC6.1: Access control policies defined and enforced
- CC7.2: System changes monitored and tested
- A1.1: Risk assessment performed
- A1.2: Mitigation strategies implemented
- CC9.2: System and infrastructure vulnerability management

**Evidence:**
- Audit logs for all access
- Change request approval workflows
- Backup verification records
- Recovery plan test results

### GDPR Compliance

**Controls Implemented:**
- Right to access: Audit logs show all data access
- Right to erasure: Data deletion tracked and logged
- Right to rectification: Data modification audit trail
- Data Protection Impact Assessment: Available

**Evidence:**
- Consent tracking in audit logs
- Data retention policies enforced
- Privacy incident response procedures
- Vendor assessment records

### Data Protection

**Encryption:**
- At rest: All backups encrypted (AES-256)
- In transit: TLS 1.3 for all API calls
- At use: Memory cleared after processing

**Access Control:**
- Role-based: Permissions checked at every operation
- Audit trail: Every access logged
- Multi-factor: Admin operations require 2FA

---

## Monitoring Dashboard

Access the Governance & Continuity Dashboard at:
```
/admin/governance
```

**Tabs:**
- **Audit** - View audit logs, filter by user/action/resource
- **Compliance** - Framework status, last audit date
- **Backups** - Backup schedule, status, verification
- **Recovery** - Recovery plans, RTO/RPO, test history
- **Lineage** - Data quality scores, sync status

---

## Conclusion

The Governance & Continuity framework ensures:
- **Compliance** with regulatory requirements (SOC2, GDPR, HIPAA)
- **Auditability** of all operations through complete audit trails
- **Resilience** through automated backups and recovery procedures
- **Transparency** via dashboard and reports
- **Continuity** with defined RTO/RPO and tested procedures

All systems are production-ready and fully integrated into the IntegrateWise platform.

