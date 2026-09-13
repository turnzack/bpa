# Workflow Automation Platform

A niche visual workflow automation platform inspired by n8n, designed for SMEs and operational teams to automate business processes without deep technical skills. It offers pre-built templates, enhanced governance, and AI-assisted workflow design.

## Features

- **Visual Workflow Editor**: Drag-and-drop nodes to create workflows.
- **Pre-built Templates**: Industry-specific templates for common processes.
- **AI Workflow Generator**: Describe a process in natural language and get a workflow draft.
- **Governance & Compliance**: Role-based access control, audit logs, and versioning.
- **Integrations**: Connect to popular services like Slack, Google Sheets, and REST APIs.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, ReactFlow, TailwindCSS
- **Backend**: Node.js, Express, PostgreSQL, Redis
- **AI**: OpenAI API, LangChain

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`).
4. Run the development server: `npm run dev`

## Architecture

- **Frontend**: Single-page application with a visual canvas.
- **Backend**: REST API for workflow management, execution, and user management.
- **Database**: PostgreSQL for persistent storage, Redis for caching and job queues.
- **AI Service**: Integrates with OpenAI to generate workflow drafts.

## License

MIT