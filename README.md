# Mito UI
## Vanguard Component Library & AI Context Server (Stroybook)

[![NPM Version](https://img.shields.io/npm/v/@emeraldemperaur/mito-ui.svg)](https://www.npmjs.com/package/@emeraldemperaur/mito-ui)
![Changesets](https://img.shields.io/badge/maintained%20with-changesets-176de3?style=flat-square&logo=changesets&logoColor=white) 

<p align='justify'><strong>Mito UI</strong> is a modern, TypeScript-first component ecosystem engineered for the next generation of web applications. Beyond offering sleek, accessible, and production-ready primitives, Mito UI pioneers <strong>AI-ready architecture</strong> tailored for agent-driven experiences <em>(conversational interfaces, generative UI and RAG pipelines)</em> and designed to integrate seamlessly into AI coding environments via the Model Context Protocol (MCP).</p>

## Private Monorepository (Request Access) 🔐
Access to the core source code is currently restricted.
<a href="https://www.github.com/emeraldemperaur/mito-ui" target="_blank">Mito UI Repository</a>

## Quick Start
<p align='justify'>Read the <a href="https://6a657230d0c8812ee04774fc-jnfasftpdt.chromatic.com/" target="_blank">official Mito UI documentation</a> for comprehensive guides on React primitives, backend architectural blueprints and MCP server deployment.</p>

## Usage

#### Install Mito UI Component Library
<p align='justify'>For standard React frontend application project:</p>

```bash
npm install @emeraldemperaur/mito-ui
```

#### Connect with AI Developer via MCP Server 
<p align='justify'>Mito UI provides an official Model Context Protocol server, allowing AI IDEs to directly read the component registry, type definitions, and backend blueprints to facilitate a hallucination-resistant developer experience.</p>

##### Option A: Remote Enterprise Connection (Frictionless Authentication)
<p align='justify'>For subscribed users, add the managed endpoint to the AI IDE's MCP configuration. Mito UI  utilizes Streamable HTTP in tandem with dynamic Clerk OAuth. IDE will automatically prompt a secure browser login with no API keys required.</p>

```json
{
  "mcpServers": {
    "mito-ui": {
      "url": "https://mito-ui.onrender.com/mcp",
      "transport": "http"
    }
  }
}
```

##### Option B: Local CLI Connection (Authentication Key)
<p align='justify'>Install the CLI package globally to run the server locally.</p>

```bash
npm install -g @emeraldemperaur/mito-ui-mcp
```

<p align='justify'>Configure the AI IDE to launch Mito UI MCP via <code>stdio</code>:</p>

```json
{
  "mcpServers": {
    "mito-ui-local": {
      "command": "npx",
      "args": [
        "@emeraldemperaur/mito-ui-mcp", 
        "--local", 
        "--key", 
        "user_secret_key_12345" 
      ]
    }
  }
}
```
<ul>
<li><a href="https://docs.openclaw.ai/gateway/configuration">Cursor MCP Configuration</a></li>
<li><a href="https://windsurf.run/mcp/filesystem">WindSurf MCP Configuration</a></li>
<li><a href="https://modelcontextprotocol.io/docs/develop/connect-remote-servers">Claude Desktop MCP Configuration</a></li>
<li><a href="https://docs.replit.com/build/connect-via-mcp#share-an-install-link">Replit MCP Configuration</a></li>
<li><a href="https://docs.devin.ai/cli/extensibility/mcp/configuration">Devin MCP Configuration</a></li>
<li><a href="https://docs.openclaw.ai/gateway/configuration">OpenClaw MCP Configuration</a></li>
</ul>

## Design System Tenets
<ul>
<li><strong>Performance:</strong></li>
<li><strong>ARIA Compliant Accessibility:</strong> Strict ARIA compliance across all primitives</li>
<li><strong>Light vs. Dark Mode:</strong> Robust Light/Dark mode support</li>
<li><strong>Theming Extensibility:</strong> Theming and styling customization support enabled via SCSS/CSS variables.</li>
<li><strong>Agentic AI Compatibility:</strong> Strongly typed TypeScript full-stack components annotated with deep JSDoc context and metadata for LLM (Large Language Model) ingestion.</li>
</ul>

## System Architecture Overview
<p align='justify'>Mito UI ecosystem is structured as a scalable monorepo:</p>
<ol>
<li><strong>Mito UI Component Library</strong> <code>@emeraldemperaur/mito-ui</code>: Named Exports React UI component library.</li>
<li><strong>Mito UI Backend Templates</strong> <code>@emeraldemperaur/mito-ui</code>: Scalable backend service & architectural blueprints.</li>
<li><strong>Mito UI Model Context Protocol Server</strong> <code>@emeraldemperaur/mito-ui-mcp</code>: Dual-transport enabled AI context server via remote <code>Streamable HTTP</code> and localhost <code>StdioServerTransport</code>.</li>
</ol>


## Build Tools
### 🎨 Frontend & Design Tools
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3dotjs&logoColor=white)


### 🛠 Dev Tools & Workflow
![PNPM Workspace](https://img.shields.io/badge/PNPM%20Workspace-222222?style=for-the-badge&logo=pnpm&logoColor=F69220)
![Husky](https://img.shields.io/badge/Husky-000000?style=for-the-badge&logo=git&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Rollup](https://img.shields.io/badge/Rollup-EC4A3F?style=for-the-badge&logo=rollupdotjs&logoColor=white)


### 🖥️ UI Component Library Deployment
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![Chromatic](https://img.shields.io/badge/Chromatic-FC521F?style=for-the-badge&logo=chromatic&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

### ☁️ Backend Templates & Build Tools
#### AI & Machine Learning
![Ada CX](https://img.shields.io/badge/Ada%20CX-0A0B0C?style=for-the-badge)
![xAI](https://img.shields.io/badge/xAI-000000?style=for-the-badge&logo=x&logoColor=white)
![Amazon Bedrock](https://img.shields.io/badge/Amazon%20Bedrock-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon SageMaker](https://img.shields.io/badge/Amazon%20SageMaker-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Watsonx](https://img.shields.io/badge/IBM%20Watsonx-052FAD?style=for-the-badge&logo=ibm&logoColor=white)

#### Authentication, Identity & Security
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![OAuth](https://img.shields.io/badge/OAuth-000000?style=for-the-badge)
![OpenID](https://img.shields.io/badge/OpenID-F78C40?style=for-the-badge&logo=openid&logoColor=white)
![SIWE](https://img.shields.io/badge/SIWE-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![SimpleWebAuthn](https://img.shields.io/badge/SimpleWebAuthn-000000?style=for-the-badge)
![OTPLib](https://img.shields.io/badge/OTPLib-000000?style=for-the-badge)
![Jumio](https://img.shields.io/badge/Jumio-00A453?style=for-the-badge)
![Trulioo](https://img.shields.io/badge/Trulioo-1CE8A8?style=for-the-badge&logoColor=black)

#### Payments Processing & eCommerce
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![Paystack](https://img.shields.io/badge/Paystack-091E42?style=for-the-badge&logo=paystack&logoColor=white)
![Flutterwave](https://img.shields.io/badge/Flutterwave-FB9129?style=for-the-badge)
![Plaid](https://img.shields.io/badge/Plaid-111111?style=for-the-badge&logo=plaid&logoColor=white)
![Shopify](https://img.shields.io/badge/Shopify-95BF47?style=for-the-badge&logo=shopify&logoColor=white)
![BigCommerce](https://img.shields.io/badge/BigCommerce-121118?style=for-the-badge&logo=bigcommerce&logoColor=white)

#### Databases & Storage
![Prisma ORM](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Snowflake](https://img.shields.io/badge/Snowflake-29B5E8?style=for-the-badge&logo=snowflake&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![Amazon S3 Vectors](https://img.shields.io/badge/Amazon%20S3%20Vectors-569A31?style=for-the-badge&logo=amazons3&logoColor=white)

#### Messaging, Queues & Data Pipelines
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Amazon SQS](https://img.shields.io/badge/Amazon%20SQS-FF4F8B?style=for-the-badge&logo=amazonsqs&logoColor=white)
![Amazon SNS](https://img.shields.io/badge/Amazon%20SNS-FF4F8B?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon EventBridge](https://img.shields.io/badge/Amazon%20EventBridge-FF4F8B?style=for-the-badge&logo=amazonaws&logoColor=white)
![Apache Airflow](https://img.shields.io/badge/Apache%20Airflow-017CEE?style=for-the-badge&logo=apacheairflow&logoColor=white)

#### Observability & Monitoring
![Amazon CloudWatch](https://img.shields.io/badge/Amazon%20CloudWatch-FF4F8B?style=for-the-badge&logo=amazoncloudwatch&logoColor=white)
![Dynatrace](https://img.shields.io/badge/Dynatrace-1496FF?style=for-the-badge&logo=dynatrace&logoColor=white)
![Elastic](https://img.shields.io/badge/Elastic-005571?style=for-the-badge&logo=elastic&logoColor=white)
![Splunk](https://img.shields.io/badge/Splunk-000000?style=for-the-badge&logo=splunk&logoColor=white)

#### Integrations, Tools & Automations
![Salesforce](https://img.shields.io/badge/Salesforce-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)
![Atlassian](https://img.shields.io/badge/Atlassian-0052CC?style=for-the-badge&logo=atlassian&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Airtable](https://img.shields.io/badge/Airtable-18BFFF?style=for-the-badge&logo=airtable&logoColor=white)
![Zapier](https://img.shields.io/badge/Zapier-FF4A00?style=for-the-badge&logo=zapier&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white)
![OpenTable](https://img.shields.io/badge/OpenTable-DA3743?style=for-the-badge&logo=opentable&logoColor=white)
![ButterflyMX](https://img.shields.io/badge/ButterflyMX-2475E8?style=for-the-badge)
![QR Code](https://img.shields.io/badge/QR%20Code-000000?style=for-the-badge)

#### Communications
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)
![Mailchimp](https://img.shields.io/badge/Mailchimp-FFE01B?style=for-the-badge&logo=mailchimp&logoColor=black)
![MailerLite](https://img.shields.io/badge/MailerLite-00A65F?style=for-the-badge&logo=mailerlite&logoColor=white)

### 📡 MCP Server Integration
![MCP SDK](https://img.shields.io/badge/@modelcontextprotocol/sdk-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Render](https://img.shields.io/badge/Render-000000?style=for-the-badge&logo=render&logoColor=white)



## Monorepo Footnotes
<p align='justify'>Ensure you are using <code>pnpm</code> as the package manager for this workspace.</p>

#### Global install PNPM via NPM
```bash
npm install -g pnpm
```

#### Publishing PNPM Workflow
<p align='justify'>To release updates to the NPM registry, authenticate and use PNPM workspace filters:</p>

##### NPM Authenticate

```bash
npm login
```

##### Publish using PNPM Filters
```bash
pnpm --filter package1name publish --access public
pnpm --filter package2name publish --access public
```
<p align='justify'>e.g.</p>

```bash
npm login
pnpm --filter @emeraldemperaur/mito-ui publish --access public
pnpm --filter @emeraldemperaur/mito-ui-mcp publish --access public
```

#### Init Husky
```bash
# Install Husky in tandem with lint-staged at the workspace root
pnpm add -wD husky lint-staged

# Initialize Husky at workspace root to create .husky folder and update package.json scripts
pnpm exec husky init
```
<p align='justify'>Configure <code>pre-commit</code> hook in <code>.husky/pre-commit</code> to run lint-staged.</p>

```bash
pnpm exec lint-staged
```

#### Changset Versioning
```bash
# Monorepo Root
pnpm add -wD @changesets/cli

# Initialize the config folder
pnpm exec changeset init

# Generate the Changeset
pnpm changeset
```

#### CLI NPM Package Publish
```bash
# Run build
pnpm run build:all

# Localhost Monorepo NPM Publish
pnpm --filter @username/repo-name publish --access public --no-git-checks
pnpm --filter @username/reponame publish --access public --no-git-checks
```