# INSTALLATION GUIDE - Sistema Completo de 29 Skills

[Installation Guide Status]

---

## Descripcion Rapida

Este documento te guia a traves de la instalacion de todos los 29+ Claude Skills en tu entorno en menos de 10 minutos.

Nivel de dificultad: Muy Facil
Tiempo estimado: 5-10 minutos
Requisitos previos: Git, Bash (o PowerShell en Windows)

---

## Que Se Instalara

### 13 Skills Originales

Superpowers (Planning)
Optimizador de Prompts
Task Orchestration
Context Management
Verificador de Datos
Humanizador
Presentaciones Visuales
Marketing Skills
Frontend Design
Canvas Design
Brand Guidelines
Web Artifacts Builder
Playwright

### 16 Skills del Ecosistema

PDF (Anthropic)
DOCX (Anthropic)
XLSX (Anthropic)
PPTX (Anthropic)
Skill-Creator (Anthropic)
Find-Skills (Vercel)
React Best Practices (Vercel)
Web Design Guidelines (Vercel)
Remotion Best Practices
Agent Sandbox
Claude SEO
Obsidian Skill
Y mas...

---

## OPCION 1: Instalacion Automatica (Recomendado)

### Paso 1: Una linea (Copy & Paste)

macOS / Linux
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/fsosnik/skills/main/install-all-skills.sh)
```

Windows (PowerShell - Como Administrador)
```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/fsosnik/skills/main/install-all-skills.ps1" -OutFile "$env:TEMP\install-skills.ps1"; & "$env:TEMP\install-skills.ps1"
```

### Paso 2: Listo!

El script automaticamente:
- Crea ~/.claude/skills/
- Descarga todos los 29 skills
- Valida cada instalacion
- Muestra resumen final

---

## OPCION 2: Instalacion Manual (Si la automatizada falla)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/fsosnik/skills.git
cd skills
```

### Paso 2: Ejecutar Script Local

macOS / Linux
```bash
bash ./install-all-skills.sh
```

Windows (PowerShell)
```powershell
./install-all-skills.ps1
```

### Paso 3: Verificar Instalacion

```bash
ls ~/.claude/skills/
```

Resultado esperado:
```
brand-guidelines/
canvas-design/
context-management/
docx/
... (29 carpetas totales)
```

---

## OPCION 3: Instalacion Selectiva (Si quieres solo algunos)

### Paso 1: Clonar el Repo

```bash
git clone https://github.com/fsosnik/skills.git
cd skills
```

### Paso 2: Instalar Skills Especificos

Solo Productivity
```bash
bash install-productivity.sh
```

Solo Design
```bash
bash install-design.sh
```

Solo Development
```bash
bash install-development.sh
```

Solo Content
```bash
bash install-content.sh
```

Solo Documentos (PDF, Word, Excel, PowerPoint)
```bash
bash install-documents.sh
```

---

## Verificacion Post-Instalacion

### Verificar que Todo Este Instalado

```bash
# Ver todos los skills
ls ~/.claude/skills/

# Contar skills instalados
ls ~/.claude/skills/ | wc -l

# Ver detalle de un skill
cat ~/.claude/skills/superpowers/SKILL.md
```

### Resultado Esperado

```
$ ls ~/.claude/skills/
agent-sandbox/
brand-guidelines/
canvas-design/
context-management/
docx/
frontend-design/
find-skills/
humanizador/
marketing-skills/
optimizador-prompts/
pdf/
playwright/
pptx/
presentaciones-visuales/
remotion-best-practices/
skill-creator/
superpowers/
task-orchestration/
verificador-datos/
web-artifacts-builder/
web-design-guidelines/
xlsx/
... (y mas)

Total: 29 skills instalados
```

---

## Integracion con Claude

### En Claude.ai (Web)

Los skills estan disponibles automaticamente. Simplemente menciona:

```
"Activa Superpowers y ayudame a..."
"Humaniza este texto"
"Verifica este post"
```

Claude cargara automaticamente el skill correspondiente.

### En Claude Code

```bash
# Los skills estan disponibles automaticamente en tu entorno
# Puedes referenciarlos directamente:

claude run "optimizador-prompts" "mejora este prompt..."
```

### Localmente (Terminal/CLI)

```bash
# Los skills estan en ~/.claude/skills/
# Puedes usarlos como referencia o integrarlos en tus scripts

cat ~/.claude/skills/superpowers/SKILL.md
```

---

## Solucion de Problemas

### "Permiso denegado" (Permission denied)

```bash
# Dar permisos de ejecucion
chmod +x install-all-skills.sh
chmod +x install-*.sh

# Luego ejecutar
bash install-all-skills.sh
```

### "No se encuentra curl" (curl: command not found)

```bash
# Instalar curl
# macOS
brew install curl

# Ubuntu/Debian
sudo apt-get install curl

# Despues:
bash <(curl -fsSL https://raw.githubusercontent.com/fsosnik/skills/main/install-all-skills.sh)
```

### "Directorio no existe"

```bash
# Crear directorio manualmente
mkdir -p ~/.claude/skills

# Clonar repo
git clone https://github.com/fsosnik/skills.git ~/claude-skills-repo
cd ~/claude-skills-repo

# Ejecutar instalador
bash install-all-skills.sh
```

### "Error descargando skill X"

```bash
# Reintentar instalacion
bash install-all-skills.sh --retry

# O instalar ese skill especificamente
mkdir -p ~/.claude/skills/skill-name
curl -o ~/.claude/skills/skill-name/SKILL.md https://raw.githubusercontent.com/.../SKILL.md
```

---

## Status de Instalacion

### Verificacion Paso a Paso

```bash
#!/bin/bash
# Ejecutar este script para verificar estado

echo "Verificando instalacion de Claude Skills..."
echo ""

SKILLS_DIR="$HOME/.claude/skills"

# Verificar que exista el directorio
if [ ! -d "$SKILLS_DIR" ]; then
    echo "Directorio $SKILLS_DIR no encontrado"
    exit 1
fi

echo "Directorio encontrado: $SKILLS_DIR"
echo ""

# Contar skills
SKILL_COUNT=$(ls -d "$SKILLS_DIR"/*/ 2>/dev/null | wc -l)
echo "Skills instalados: $SKILL_COUNT"
echo ""

# Listar todos
echo "Lista de skills:"
ls -1 "$SKILLS_DIR" | while read skill; do
    if [ -f "$SKILLS_DIR/$skill/SKILL.md" ]; then
        echo "  OK - $skill"
    else
        echo "  ERROR - $skill (incompleto)"
    fi
done

echo ""
echo "Instalacion verificada"
```

---

## Actualizaciones Futuras

### Actualizar Todos los Skills

```bash
# Una sola linea
bash <(curl -fsSL https://raw.githubusercontent.com/fsosnik/skills/main/update-all-skills.sh)
```

### Actualizar Solo Algunos

```bash
cd ~/claude-skills-repo
git pull origin main
bash install-all-skills.sh --force
```

---

## Proximos Pasos

### Una Vez Instalados

1. Lee la documentacion

```
Abre: https://github.com/fsosnik/skills/blob/main/QUICK-START.md
```

2. Prueba tu primer skill

```
En Claude.ai: "Activa Superpowers y..."
```

3. Explora la matriz de flujos

```
Ver: https://github.com/fsosnik/skills/blob/main/MATRIX.md
```

4. Usa casos reales

```
Consulta: https://github.com/fsosnik/skills/blob/main/EXAMPLES.md
```

---

## Caracteristicas Post-Instalacion

Una vez instalados, tienes acceso a:

### 13 Metodologias Propias

- Planning riguroso
- Prompts optimizados
- Textos humanizados
- Diseno distinctive
- Y mucho mas...

### 16 Skills del Ecosistema

- Generacion de PDFs, Word, Excel, PowerPoint
- Busqueda de skills
- Creacion de nuevos skills
- React best practices
- Automatizacion web
- Y mas...

### Documentacion Completa

- Guias por skill
- Matriz de compatibilidad
- Ejemplos de uso
- Flujos predefinidos
- Solucion de problemas

---

## Opciones de Instalacion Resumidas

| Opcion | Tiempo | Complejidad | Ideal Para |
|--------|--------|-------------|-----------|
| Automatica (1 linea) | 2 min | Muy Facil | Todos |
| Manual (Repo + Script) | 5 min | Facil | Que prefieran control |
| Selectiva (Skills elegidos) | 3 min | Facil | Uso especifico |
| Docker | 5 min | Medio | Entorno limpio |

---

## Validacion Final

```bash
Existen los archivos?
Estan en el directorio correcto?
Puedes leerlos?
Puedes referenciarlos en Claude?

Si todas son si -> INSTALACION EXITOSA!
```

---

## Ayuda & Soporte

Si tienes problemas:

1. Revisa FAQ.md - Preguntas comunes
2. Abre un Issue - Reporte el problema
3. Contacta en Discussions - Pregunta la comunidad
4. Email: fsosnik@example.com

---

## Listo para Empezar!

Una vez instalados los skills, ve a:

- QUICK-START.md - Primeros pasos
- SKILLS-INDEX.md - Indice de todos los skills
- MATRIX.md - Matriz de compatibilidad
- EXAMPLES.md - Casos de uso reales

---

Instalacion completada en minutos, beneficios para siempre.

Tu entorno de Claude esta listo!
29+ Skills instalados y documentados
Ahora, a crear cosas increibles
