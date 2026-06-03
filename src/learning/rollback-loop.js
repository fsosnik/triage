/**
 * TRIAGE OS - Rollback Loop
 * Layer 5b: Error Recovery System
 * 
 * Características:
 * - Detecta fallos
 * - Revierte cambios automáticamente
 * - Actualiza blocklist dinámicamente
 * - Penaliza agentes que fallaron
 * - Aprende de errores
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RollbackLoop {
  constructor() {
    this.failureLog = [];
    this.loadFailureLog();
  }

  /**
   * Cargar histórico de fallos
   */
  loadFailureLog() {
    try {
      const file = path.join(process.cwd(), '.claude/learning/failures.json');
      if (fs.existsSync(file)) {
        this.failureLog = JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
    } catch (e) {
      this.failureLog = [];
    }
  }

  /**
   * Guardar histórico de fallos
   */
  saveFailureLog() {
    try {
      const dir = path.join(process.cwd(), '.claude/learning');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      const file = path.join(dir, 'failures.json');
      fs.writeFileSync(file, JSON.stringify(this.failureLog, null, 2));
    } catch (e) {
      console.warn('⚠️  Could not save failure log');
    }
  }

  /**
   * Manejar fallo de validación
   */
  async handleFailure(task, failedAgents, failureDetails) {
    console.log('\n' + '═'.repeat(60));
    console.log('❌ ROLLBACK LOOP - Handling Failure');
    console.log('═'.repeat(60) + '\n');

    const failureRecord = {
      timestamp: new Date().toISOString(),
      task: task,
      failed_agents: failedAgents,
      failure_reason: failureDetails.reason,
      failure_type: this.classifyFailure(failureDetails),
      severity: this.calculateSeverity(failureDetails),
      incident_count: 0
    };

    console.log(`\n📋 Failure Details:`);
    console.log(`   Task: ${task}`);
    console.log(`   Failed agents: ${failedAgents.join(', ')}`);
    console.log(`   Reason: ${failureDetails.reason}`);
    console.log(`   Type: ${failureRecord.failure_type}`);
    console.log(`   Severity: ${failureRecord.severity}`);

    // 1. Actualizar blocklist
    this.updateBlocklist(failureRecord);

    // 2. Penalizar agentes fallidos
    this.penalizeAgents(failedAgents);

    // 3. Intentar revert
    if (failureDetails.canRevert) {
      await this.revertChanges(failureRecord);
    }

    // 4. Registrar fallo
    this.recordFailure(failureRecord);

    console.log(`\n✓ Rollback completed`);
    console.log(`  Blocklist updated: ${this.getBlocklistSize()} entries`);
    console.log(`  Agents penalized: ${failedAgents.length}`);
  }

  /**
   * Clasificar tipo de fallo
   */
  classifyFailure(details) {
    const reason = (details.reason || '').toLowerCase();
    
    if (reason.includes('test')) return 'test_failure';
    if (reason.includes('build')) return 'build_failure';
    if (reason.includes('type')) return 'type_error';
    if (reason.includes('validation')) return 'validation_error';
    if (reason.includes('security')) return 'security_issue';
    
    return 'unknown';
  }

  /**
   * Calcular severidad (1-5)
   */
  calculateSeverity(details) {
    if (details.reason.includes('CRÍTICO')) return 5;
    if (details.reason.includes('security')) return 4;
    if (details.reason.includes('data')) return 4;
    if (details.reason.includes('test')) return 2;
    return 3;
  }

  /**
   * Actualizar blocklist dinámicamente
   */
  updateBlocklist(failureRecord) {
    console.log('\n🚫 Updating blocklist...');

    try {
      const file = path.join(process.cwd(), '.claude/patterns/blocklist.json');
      let blocklist = [];
      
      if (fs.existsSync(file)) {
        blocklist = JSON.parse(fs.readFileSync(file, 'utf-8'));
      }

      // Buscar si el patrón ya existe
      const existingEntry = blocklist.find(b => b.id === failureRecord.task);

      if (existingEntry) {
        existingEntry.incidents = (existingEntry.incidents || 0) + 1;
        
        // Si 3+ incidentes, escalate a CRÍTICO
        if (existingEntry.incidents >= 3) {
          existingEntry.severity = 'CRÍTICO';
          existingEntry.auto_reject = true;
          console.log(`  ⚠️  Escalated to CRITICAL (${existingEntry.incidents} incidents)`);
        }
      } else {
        // Crear nuevo entry
        const newEntry = {
          id: `learned-${Date.now()}`,
          pattern: failureRecord.task.substring(0, 50),
          severity: failureRecord.severity >= 4 ? 'CRÍTICO' : 'WARNING',
          reason: `Learned from failure: ${failureRecord.failure_type}`,
          incidents: 1,
          auto_reject: failureRecord.severity >= 4,
          alternative: `Use different approach - consult learning log`,
          created_at: new Date().toISOString()
        };
        
        blocklist.push(newEntry);
        console.log(`  ➕ Added new blocklist entry`);
      }

      fs.writeFileSync(file, JSON.stringify(blocklist, null, 2));
      
    } catch (e) {
      console.warn('⚠️  Could not update blocklist:', e.message);
    }
  }

  /**
   * Penalizar agentes que fallaron
   */
  penalizeAgents(failedAgents) {
    console.log('\n⬇️  Penalizing agents...');

    try {
      const weightsFile = path.join(process.cwd(), '.claude/learning/weights.json');
      let weights = {
        code: 0.8,
        qa: 0.6,
        research: 0.5,
        risk: 0.7
      };

      if (fs.existsSync(weightsFile)) {
        weights = JSON.parse(fs.readFileSync(weightsFile, 'utf-8'));
      }

      failedAgents.forEach(agent => {
        const currentWeight = weights[agent] || 0.5;
        const newWeight = Math.max(0.1, currentWeight - 0.25); // Penalidad fuerte
        weights[agent] = parseFloat(newWeight.toFixed(2));
        console.log(`  ${agent}: ${currentWeight.toFixed(2)} → ${newWeight.toFixed(2)}`);
      });

      fs.writeFileSync(weightsFile, JSON.stringify(weights, null, 2));

    } catch (e) {
      console.warn('⚠️  Could not update weights:', e.message);
    }
  }

  /**
   * Revertir cambios (git revert)
   */
  async revertChanges(failureRecord) {
    console.log('\n↩️  Reverting changes...');

    try {
      // Intentar git revert del último commit
      execSync('git revert HEAD --no-edit', { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
      console.log(`  ✓ Git reverted`);
      
      // Crear checkpoint de revert
      this.createRevertCheckpoint(failureRecord);

    } catch (e) {
      console.log(`  ⚠️  Could not revert (not in git repo)`);
    }
  }

  /**
   * Crear checkpoint de revert
   */
  createRevertCheckpoint(failureRecord) {
    try {
      const dir = path.join(process.cwd(), '.claude/checkpoints');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const checkpoint = {
        type: 'revert',
        timestamp: new Date().toISOString(),
        reason: failureRecord.failure_reason,
        task: failureRecord.task,
        severity: failureRecord.severity
      };

      const filename = `revert-${Date.now()}.json`;
      fs.writeFileSync(
        path.join(dir, filename),
        JSON.stringify(checkpoint, null, 2)
      );

      console.log(`  📌 Revert checkpoint: ${filename}`);

    } catch (e) {
      console.warn('⚠️  Could not create checkpoint');
    }
  }

  /**
   * Registrar fallo en histórico
   */
  recordFailure(failureRecord) {
    this.failureLog.push(failureRecord);
    this.saveFailureLog();
  }

  /**
   * Obtener tamaño actual de blocklist
   */
  getBlocklistSize() {
    try {
      const file = path.join(process.cwd(), '.claude/patterns/blocklist.json');
      if (fs.existsSync(file)) {
        const blocklist = JSON.parse(fs.readFileSync(file, 'utf-8'));
        return blocklist.length;
      }
    } catch (e) {
      // Skip
    }
    return 0;
  }

  /**
   * Obtener estadísticas de fallos
   */
  getStats() {
    const totalFailures = this.failureLog.length;
    const criticalFailures = this.failureLog.filter(f => f.severity >= 4).length;
    const avgSeverity = this.failureLog.length > 0
      ? (this.failureLog.reduce((sum, f) => sum + f.severity, 0) / totalFailures).toFixed(1)
      : 0;

    return {
      total_failures: totalFailures,
      critical_failures: criticalFailures,
      avg_severity: avgSeverity,
      latest_failure: this.failureLog[this.failureLog.length - 1] || null
    };
  }
}

module.exports = RollbackLoop;
