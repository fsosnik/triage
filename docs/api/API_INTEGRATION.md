# API_INTEGRATION.md — MCPs y Herramientas Externas

> Cómo conectar cada herramienta externa para máxima funcionalidad con mínimo consumo.

---

## 📋 Matriz de Herramientas

| Herramienta | Tipo | Prioridad | Setup | Consumo | Estado |
|------------|------|-----------|-------|---------|---------|
| **GitHub API** | REST | ⭐⭐⭐ | 10min | 0 (local ops) | 🔴 TODO |
| **Anthropic API** | REST | ⭐⭐⭐ | 5min | ⭐⭐⭐ (core) | 🟢 READY |
| **Web Search** | MCP | ⭐⭐ | 0min | ⭐⭐ | 🟢 READY |
| **Notion MCP** | MCP | ⭐⭐ | 20min | Bajo | 🔴 TODO |
| **Slack MCP** | MCP | ⭐ | 15min | 0 (output) | 🔴 TODO |
| **Claude Code** | IDE | ⭐⭐ | 5min | Bajo | 🟢 READY |
| **Cowork** | Desktop | ⭐ | 10min | Muy bajo | 🔴 TODO |
| **NotebookLM** | Analysis | ⭐ | N/A | Muy bajo | 🟡 OPTIONAL |

---

## 🚀 Priority 1: ESSENTIAL (Semana 1)

### 1.1 GitHub API

**¿Para qué?**: Git operations (clone, commit, push, PR), automatizar workflows.

**Setup** (10 min):

```bash
# 1. Generar Personal Access Token
# GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
# Permisos: repo, workflow, gist

# 2. Guardar en .env
echo "GITHUB_TOKEN=ghp_xxxxxxxxxxxx" >> .env
echo "GITHUB_REPO=fsosnik/ai-os" >> .env

# 3. Instalar octokit (JavaScript)
npm install @octokit/rest
# O en Python
pip install PyGithub
```

**Uso en Code Agent**:

```javascript
// scripts/git-operations.js
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Operaciones disponibles:
// - octokit.repos.get()
// - octokit.repos.createDispatchEvent()
// - octokit.pulls.create()
// - octokit.issues.create()
```

**Consumo**: 0 tokens (es local, solo requiere autenticación)

**Ejemplo de workflow**:
```python
def git_commit_and_push(files, message):
    # No consume tokens, es CLI local
    subprocess.run(["git", "add"] + files)
    subprocess.run(["git", "commit", "-m", message])
    subprocess.run(["git", "push", "origin", "main"])
    return git_log()[-1]  # Retorna commit hash
```

---

### 1.2 Anthropic API (Multi-Agent)

**¿Para qué?**: Orquestar 4 agentes simultáneamente, cache de patrón library.

**Setup** (5 min):

```bash
# 1. API Key ya existe (estás usándolo aquí)
echo "ANTHROPIC_API_KEY=sk-xxxxxxxxxxxx" >> .env

# 2. Instalar SDK
npm install @anthropic-ai/sdk
# O usar curl/fetch directo
```

**Uso en Core OS**:

```javascript
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function orchestrate_agents(task, agents_to_use) {
  // Ejecutar 4 agentes en paralelo
  const results = await Promise.all(
    agents_to_use.map((agent) =>
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,  // Mantener bajo para consumo
        system: `${agent.system_prompt}\n\nTarea: ${task}`,
        messages: [
          {
            role: "user",
            content: task,
          },
        ],
      })
    )
  );
  
  return results;
}
```

**Optimizaciones de consumo**:

```javascript
// 1. Cache de Pattern Library
const pattern = load_pattern(task_type);
if (pattern.success_rate > 0.8) {
  // Usar cached pattern, reduce contexto
  const cached_system = pattern.system_prompt;  // Corto
  const cached_messages = pattern.messages;      // Mínimo
  // Los parámetros cache_control ahorran tokens en subsecuentes
}

// 2. Usar cache_control en Anthropic API
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "Eres un agent...",
    },
    {
      type: "text",
      text: pattern_library,  // Este se cachea
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [
    {
      role: "user",
      content: task,
    },
  ],
});
```

**Consumo**: ⭐⭐⭐ (es el core, pero optimizable con cache)

---

### 1.3 LocalStorage / JSON (Pattern Persistence)

**¿Para qué?**: Guardar pattern library y blocklist localmente.

**Setup** (2 min):

```bash
# Ya viene con Node.js
# Solo necesita archivos JSON en .claude/patterns/
```

**Estructura**:

```
.claude/patterns/
├── successes.json      # Pattern library
├── blocklist.json      # Patrón bloqueados
└── checkpoints/        # Histórico de ciclos
    ├── 2026-06-03T14-30.json
    └── ...
```

**Uso**:

```javascript
// Load pattern library
const patterns = JSON.parse(
  fs.readFileSync(".claude/patterns/successes.json", "utf-8")
);

// Find similar pattern
function find_pattern(task_type) {
  return patterns.find(
    (p) => p.task_type === task_type && p.success_rate > 0.8
  );
}

// Save new pattern (después de éxito)
patterns.push(new_pattern);
fs.writeFileSync(
  ".claude/patterns/successes.json",
  JSON.stringify(patterns, null, 2)
);
```

**Consumo**: 0 tokens (local)

---

## 🔄 Priority 2: IMPORTANT (Semana 2)

### 2.1 Web Search (Research Agent)

**¿Para qué?**: Investigación de best practices, librerías, breaking changes.

**Setup** (0 min — ya funciona):

Ya está integrado en Claude. El Research Agent puede usar `web_search` directamente.

**Cómo se usa**:

```markdown
# Research Agent

Cuando el Core OS activa al Research Agent:

INVESTIGAR:
- Best practices para [tarea]
- Librerías alternativas
- Breaking changes

El Research Agent automáticamente usa web_search
si necesita información actualizada.
```

**Consumo**: ⭐⭐ (~100-200 tokens cuando se activa)

**Optimización**: Activar Research Agent solo si:
- Tarea es NUEVA (no hay patrón)
- Dependencias cambiaron
- Versión > 1 año atrás

---

### 2.2 Notion MCP (Distributed Knowledge Base)

**¿Para qué?**: Documentar aprendizajes fuera del repo, usar como referencia en equipo.

**Setup** (20 min):

```bash
# 1. Crear Notion Integration
# Notion → Settings & members → Developer → New integration
# Copy "Internal Integration Token"

# 2. Guardar en .env
echo "NOTION_TOKEN=secret_xxxxxxxxxxxx" >> .env

# 3. Crear base de datos Notion
# Notion → + → Database → "AI OS Patterns"
# Campos: id, task_type, agents, success_rate, timestamp

# 4. Obtener database ID
# Notion URL: https://notion.so/[username]/[DATABASE_ID]?v=...
echo "NOTION_DATABASE_ID=xxxxxxxxxxxx" >> .env

# 5. Instalar client
npm install @notionhq/client
```

**Uso en Learning Loop**:

```javascript
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function save_pattern_to_notion(pattern) {
  await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      "Task Type": {
        title: [{ text: { content: pattern.task_type } }],
      },
      "Agents Used": {
        multi_select: pattern.agents.map((a) => ({
          name: a,
        })),
      },
      "Success Rate": {
        number: pattern.success_rate,
      },
      "Cost (tokens)": {
        number: pattern.cost,
      },
    },
  });
}
```

**Consumo**: Muy bajo (solo cuando se guarda un patrón, ~50 tokens/mes)

---

### 2.3 Claude Code (IDE Integration)

**¿Para qué?**: Desarrollar más rápido, con AI completions.

**Setup** (5 min):

```bash
# Descargar Claude Code
# https://claude.ai/claude-code

# O instalar en tu editor favorito:
# - VS Code: ext install Anthropic.claude-code
# - JetBrains: Plugins → Anthropic Claude Code
```

**Uso**: Escribir código desde el IDE, Claude sugiere/autocompleta.

**Consumo**: Bajo (depende de uso)

---

## 🟡 Priority 3: OPTIONAL (Semana 3+)

### 3.1 Slack MCP (Notifications)

**¿Para qué?**: Notificar cuando ciclos se completan, alertas de fallos.

**Setup** (15 min):

```bash
# 1. Crear Slack App
# api.slack.com → Create New App → From scratch
# Name: "AI OS"

# 2. Enable incoming webhooks
# Features → Incoming Webhooks → Add New Webhook to Workspace

# 3. Guardar webhook URL
echo "SLACK_WEBHOOK_URL=https://hooks.slack.com/..." >> .env
```

**Uso en Checkpoint**:

```javascript
async function notify_checkpoint(checkpoint) {
  const message = {
    text: `✅ Ciclo completado: ${checkpoint.task}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Ciclo Completado*\n${checkpoint.task}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Cost: ${checkpoint.cost} tokens | Success: ${checkpoint.success_rate}%`,
          },
        ],
      },
    ],
  };

  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify(message),
  });
}
```

**Consumo**: 0 tokens (es output solo)

---

### 3.2 Cowork (Desktop Automation)

**¿Para qué?**: Ejecutar scripts y tareas automatizadas en background.

**Setup** (10 min):

Cowork es una herramienta de Anthropic para automatización sin código.

```bash
# Descargar Cowork
# https://anthropic.com/cowork

# Configurar plugin para AI OS:
# 1. Create plugin → "ai-os-orchestrator"
# 2. Define triggers (hora, evento, manual)
# 3. Define actions (ejecutar script, notify, commit)
```

**Ejemplo de plugin**:
```yaml
# plugins/ai-os-orchestrator.yml
name: ai-os-orchestrator
triggers:
  - type: schedule
    cron: "0 9 * * 1-5"  # Lunes a viernes, 9am
actions:
  - type: exec
    command: npm run orchestrate
  - type: notify
    service: slack
    message: "✅ Ciclo diario completado"
```

**Consumo**: Muy bajo (meta-automatización)

---

### 3.3 NotebookLM (Optional - Document Analysis)

**¿Para qué?**: Analizar documentos largos sin cargar todo en contexto.

**Cuándo usar**: Si tienes wikis/docs largos que necesitan análisis.

**Setup**: N/A (no necesario para MVP)

**Alternativa**: Usar `web_search` + `web_fetch` para capítulos específicos.

---

## 🔗 Arquitectura de Integraciones

```
┌─────────────────────────────────────────┐
│         Anthropic API (Core)            │
│  (Claude messages, cache, multi-agent)  │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┼─────────────┬────────┬────────┐
    │         │             │        │        │
    ▼         ▼             ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌──────────┐ ┌────┐ ┌──────┐
│GitHub │ │Notion │ │Web Search│ │Slack│ │Cowork│
│ API   │ │ MCP   │ │  (built) │ │MCP  │ │      │
└───────┘ └───────┘ └──────────┘ └────┘ └──────┘
    │         │             │        │        │
    └─────────┴─────────────┴────────┴────────┘
              │
    ┌─────────▼──────────┐
    │  Pattern Library   │
    │  (JSON + Notion)   │
    └────────────────────┘
              │
    ┌─────────▼──────────┐
    │  Checkpoints       │
    │  (JSON local)      │
    └────────────────────┘
```

---

## 📊 Checklist de Setup

### Semana 1 (ESSENTIAL)
- [ ] GitHub API token generado
- [ ] Anthropic API key confirmado
- [ ] `.claude/patterns/` estructura creada
- [ ] `config/settings.json` listo

### Semana 2 (IMPORTANT)
- [ ] Notion integration creado
- [ ] Web Search funcionando en Research Agent
- [ ] Claude Code instalado

### Semana 3+ (OPTIONAL)
- [ ] Slack webhook integrado
- [ ] Cowork plugin creado
- [ ] Notificaciones automáticas

---

## 🔐 Seguridad

### Variables de Entorno

```bash
# .env (NO commitear)
GITHUB_TOKEN=ghp_...
GITHUB_REPO=fsosnik/ai-os
ANTHROPIC_API_KEY=sk-...
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=...
SLACK_WEBHOOK_URL=https://...
```

### .gitignore

```
.env
.env.*
!.env.example
```

### .env.example (commitear)

```
# GitHub
GITHUB_TOKEN=your_token_here
GITHUB_REPO=fsosnik/ai-os

# Anthropic
ANTHROPIC_API_KEY=your_key_here

# Notion (optional)
NOTION_TOKEN=your_token_here
NOTION_DATABASE_ID=your_db_id_here

# Slack (optional)
SLACK_WEBHOOK_URL=your_webhook_here
```

---

## 📈 Roadmap de Integración

```
Week 1: GitHub API + Pattern persistence
  └─ Objetivo: Automatizar git operations

Week 2: Notion + Web Search
  └─ Objetivo: Knowledge base distribuido

Week 3: Slack + Cowork
  └─ Objetivo: Alertas + automatización

Week 4: NotebookLM (si necesario)
  └─ Objetivo: Análisis de docs largos
```

---

## 🧪 Testing Integrations

```bash
# Test GitHub API
npm run test:github

# Test Anthropic API (multi-agent)
npm run test:agents

# Test Pattern persistence
npm run test:patterns

# Test Notion (si configurado)
npm run test:notion

# Test Slack (si configurado)
npm run test:slack
```

---

**Versión**: 1.0  
**Status**: Design Complete  
**Última actualización**: 2026-06-03
