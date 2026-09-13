/* Instruction Pack Builder — generates the blind-bag virtual folder */

class PackBuilder {
  static build(projectName, projectDescription, options = {}) {
    const now = new Date().toISOString();
    const documents = this.generateDocuments(projectName, projectDescription, options);

    const state = {
      currentStep: 0,
      completedSteps: [],
      lockedSteps: {},
      accessLog: [],
      artifacts: {},
      codeFiles: [],
      createdAt: now,
      updatedAt: now,
      status: "intake_complete",
      folderName: options.folderName || projectName.replace(/[^a-zA-Z0-9_-]/g, "_"),
      execMode: options.execMode || "web",
      webAi: options.webAi || "deepseek",
    };

    return {
      projectName,
      projectDescription,
      documents,
      state,
      version: "16.0.0",
    };
  }

  static generateDocuments(name, description, options = {}) {
    const docs = {};
    docs["00_PROJECT_META.md"] = this.projectMeta(name, description, options);
    docs["01_PRD.md"] = this.placeholder(
      "01_PRD.md",
      "Product Requirements Document",
      `Define the complete product requirements for "${name}".\nProject brief: ${description}\n\nInclude: goals, user stories, functional requirements, non-functional requirements, acceptance criteria, out-of-scope.`
    );
    docs["02_ARCHITECTURE.md"] = this.placeholder(
      "02_ARCHITECTURE.md",
      "Technical Architecture",
      `Define the technical architecture for "${name}".\nInclude: tech stack, component diagram (text), data model, API design, security, deployment, folder structure rationale.`
    );
    docs["03_SKILLS.yaml"] = this.placeholder(
      "03_SKILLS.yaml",
      "Skills Definition",
      `List the skills and capabilities needed for "${name}" in YAML format.\nInclude skill name, description, inputs, outputs, and dependencies.`
    );
    docs["04_TASKS.md"] = this.placeholder(
      "04_TASKS.md",
      "Task Breakdown",
      `Break down "${name}" into ordered, actionable implementation tasks.\nEach task: id, title, description, dependencies, estimated complexity, deliverable files.`
    );
    docs["05_FILE_TREE.md"] = this.placeholder(
      "05_FILE_TREE.md",
      "File Tree",
      `Define the complete file and folder layout for "${name}".\nUse a tree structure. Mark each file with its purpose in a comment.`
    );
    docs["06_PROMPT_WORKFLOW.md"] = this.placeholder(
      "06_PROMPT_WORKFLOW.md",
      "Prompt Workflow",
      `Describe how code-generation prompts should be sequenced for "${name}".\nInclude phases, what context to pass, expected output format per phase.`
    );
    docs["07_VALIDATION_RULES.md"] = this.validationRules();
    docs["08_ORDERS.md"] = this.ordersDoc();
    return docs;
  }

  static projectMeta(name, description, options = {}) {
    return [
      `# Project: ${name}`,
      "",
      `**Description:** ${description}`,
      "",
      `**Created:** ${new Date().toISOString()}`,
      `**Exec Mode:** ${options.execMode || "web"}`,
      `**Web AI:** ${options.webAi || "deepseek"}`,
      `**Folder:** ${options.folderName || name}`,
      "",
      "## Pipeline Stages (4 layers)",
      "",
      "1. **Intake** — user provides project name + description + target folder",
      "2. **Pack generation** — extension builds instruction pack (blind bag)",
      "3. **Blind-bag release** — documents revealed one at a time to the LLM",
      "4. **Step-by-step orchestration** — LLM produces one artifact per step",
      "",
      "## Architecture Principle",
      "",
      "The extension is the **orchestrator**. The LLM is a **controlled executor**",
      "that only sees the document it is explicitly given at each step.",
      "",
      "## Target Output",
      "",
      "1. Complete set of project specification documents",
      "2. Generated application source code (JSON files array)",
      "3. All files written to the user-selected disk folder",
    ].join("\n");
  }

  static placeholder(filename, title, instruction) {
    return [
      `# ${title}`,
      "",
      `> Document: \`${filename}\``,
      "",
      `**Instruction:** ${instruction}`,
      "",
      "This document will be filled by the LLM executor at the appropriate pipeline step.",
      "Produce COMPLETE, production-quality content. No placeholders. No TODOs.",
    ].join("\n");
  }

  static validationRules() {
    return [
      "# Validation Rules",
      "",
      "Each artifact produced by the LLM must pass these checks:",
      "",
      "## 1. Non-Empty",
      "Content must be non-empty and meaningful (> 50 chars, not just title).",
      "",
      "## 2. Format Match",
      "- `.md` files: valid Markdown with at least one heading",
      "- `.yaml` files: valid YAML with key-value pairs",
      "",
      "## 3. Relevance",
      "Artifact must match the document's stated purpose.",
      "",
      "## 4. Step Alignment",
      "Artifact must correspond to the current pipeline step.",
      "",
      "## 5. No Code Injection in Specs",
      "Spec documents must not contain `<script>` tags.",
      "",
      "## 6. Code Generation Rules (codegen step)",
      "- Output format: `{\"files\":[{\"path\":\"...\",\"content\":\"...\",\"language\":\"...\"}]}`",
      "- No conversational text (Silence Absolu)",
      "- index.html lowercase with id=\"root\"",
      "- HashRouter only, never BrowserRouter",
      "- package.json type:module, build:vite build",
    ].join("\n");
  }

  static ordersDoc() {
    const orders = PIPELINE_STEPS.filter((s) => s.document).map(
      (s) => `- Step ${s.id}: \`{"action": "${s.order}", "document": "${s.document}"}\` — ${s.label}`
    );
    return [
      "# Orders",
      "",
      "Ordered list of commands the extension sends to the LLM:",
      "",
      ...orders,
      "",
      '- Step 9: `{"action": "codegen"}` — generate full application source code',
      '- Step 10: `{"action": "finalize"}` — write all validated artifacts + code to disk',
      "",
      "## Gatekeeper Rules",
      "",
      "- LLM may only access the document of the CURRENT step",
      "- Unauthorized access → error + list of available documents + retry",
      "- Steps are locked after completion",
      "- Advance only after current step is validated",
    ].join("\n");
  }
}
