# Backend Read/Write Operations Mapping
## Complete Analysis: `data/projects` vs `data/brand-assets`

**Date**: April 19, 2026  
**Status**: Primary transition in progress with dual-mode fallback logic

---

## DIRECTORY STRUCTURE

### Primary Root
```
/opt/mh-assistant/data/projects/
├── registry.json
├── <projectName>/
│   ├── project.json
│   ├── brand-assets/           ← NEW: Project-owned media
│   ├── products/
│   ├── content/
│   ├── campaigns/
│   ├── launch/
│   ├── execution/
│   ├── optimization/
│   ├── reports/
│   ├── integrations/
│   └── uploads/
└── ...
```

### Legacy Root  
```
/opt/mh-assistant/data/brand-assets/
├── <projectName>/
│   ├── brand-profile.json
│   ├── media-input-registry.json
│   ├── logo/
│   ├── product/
│   ├── packaging/
│   ├── reference/
│   ├── video/
│   ├── generated/                 ← Outputs stay here
│   ├── channels/
│   │   ├── meta/
│   │   ├── tiktok/
│   │   ├── youtube/
│   │   └── marketplace/
│   ├── email/
│   │   ├── html/
│   │   └── prepared/
│   └── launch-ops/
│       ├── connectors/
│       └── scheduler/
└── ...
```

---

## ROUTING LOGIC

### Function: `getProjectBrandPaths(projectName)`
**Location**: [server.js#L3170](runtime/orchestrator-service/server.js#L3170)

**Logic Flow**:
```javascript
1. Try to find: /opt/mh-assistant/data/projects/<projectName>/project.json

IF exists:
  → baseDir = /opt/mh-assistant/data/projects/<projectName>/brand-assets
  → STATUS: PROJECT-OWNED (PRIMARY)
  
ELSE:
  → baseDir = /opt/mh-assistant/data/brand-assets/<projectName>
  → STATUS: LEGACY (FALLBACK)
```

**Returns**:
```javascript
{
  baseDir: "...path to active directory...",
  legacyBaseDir: "/opt/mh-assistant/data/brand-assets/<projectName>",
  registryPath: "<baseDir>/media-input-registry.json",
  brandProfilePath: "<baseDir>/brand-profile.json",
  logoDir: "<baseDir>/logo",
  packagingDir: "<baseDir>/packaging",
  productDir: "<baseDir>/product",
  referenceDir: "<baseDir>/reference",
  videoDir: "<baseDir>/video"
}
```

---

## EXACT USAGE MAP

### 1. PROJECT LISTING & DISCOVERY

#### Endpoint: `GET /media-manager/projects`
**Frontend Function**: `fetchProjects()` → [api.js#L99](public/control-center/api.js#L99)  
**Backend Function**: `listMediaManagerProjects()` → [server.js#L3253](runtime/orchestrator-service/server.js#L3253)

**Reads From**:
| Source | Path | Usage |
|--------|------|-------|
| PRIMARY | `/opt/mh-assistant/data/projects/registry.json` | Get project list |
| PRIMARY | `/opt/mh-assistant/data/projects/<projectName>/project.json` | Determine if project-owned |
| LEGACY | `/opt/mh-assistant/data/brand-assets/<projectName>` | Check if legacy project exists |

**Dependencies**: 
- `listProjectNamesWithProfiles()` - reads projects registry
- `listLegacyMediaProjectNames()` - reads brand-assets directory
- Prefers project-owned > legacy in sorting

**Output Classification** (Frontend [library.js#L88-89](public/control-center/pages/library.js#L88-89)):
```
if (filePath.includes("/data/projects/")) → "Project-owned"
if (filePath.includes("/data/brand-assets/")) → "Legacy library"
```

---

### 2. PROJECT CREATION

#### Function: `createProject(projectName, market, language, projectType, websiteUrl)`
**Location**: [server.js#L3900](runtime/orchestrator-service/server.js#L3900)

**Writes To**:
| Target | Path | Content |
|--------|------|---------|
| PRIMARY | `/opt/mh-assistant/data/projects/registry.json` | Append new project record |
| PRIMARY | `/opt/mh-assistant/data/projects/<projectName>/project.json` | Project metadata file |
| PRIMARY | `/opt/mh-assistant/data/projects/<projectName>/brand-assets/` | Create directory |
| PRIMARY | `/opt/mh-assistant/data/projects/<projectName>/products/` | Create directory |
| PRIMARY | `/opt/mh-assistant/data/projects/<projectName>/content/` | Create directory |
| PRIMARY | `/opt/mh-assistant/data/projects/<projectName>/campaigns/` | Create directory |
| PRIMARY | `/opt/mh-assistant/data/projects/<projectName>/launch/` | Create directory |
| PRIMARY | `/opt/mh-assistant/data/projects/<projectName>/execution/` | Create directory |

**Called By**:
- POST `/media-manager/project/create` (implied from createProject usage)
- Control center initialization workflow

---

### 3. MEDIA UPLOAD (DUAL-MODE)

#### Endpoint: `POST /media/upload`
**Frontend**: [durable-ui.js](public/control-center/durable-ui.js) (upload handler)  
**Backend**: [server.js#L5586](runtime/orchestrator-service/server.js#L5586)

**Flow Decision**:
```javascript
uploadTarget = resolveUploadTarget(project, type)
  → calls getProjectBrandPaths(project)
  → determines mode
  
IF project.json exists:
  mode = "project_catalog"
  target = /opt/mh-assistant/data/projects/<projectName>/<type>

ELSE:
  mode = "legacy_media"
  target = /opt/mh-assistant/data/brand-assets/<projectName>/<type>
```

**Writes To (Mode-Dependent)**:

#### Mode: `project_catalog` (PRIMARY)
| Target | Content |
|--------|---------|
| `/opt/mh-assistant/data/projects/<projectName>/assets-registry.json` | Append asset record |
| `/opt/mh-assistant/data/projects/<projectName>/<type>/<file>` | Store uploaded file |

**Registry Record Format**:
```json
{
  "asset_id": "asset_<timestamp>",
  "project": "projectName",
  "asset_type": "logo|product|packaging|etc",
  "file_path": "/absolute/path",
  "exists": true,
  "registered_at": "ISO-8601"
}
```

#### Mode: `legacy_media` (FALLBACK)
| Target | Content |
|--------|---------|
| `/opt/mh-assistant/data/brand-assets/<projectName>/media-input-registry.json` | Append asset record |
| `/opt/mh-assistant/data/brand-assets/<projectName>/<type>/<file>` | Store uploaded file |

**Registry Record Format**:
```json
{
  "id": "upload_<timestamp>",
  "project_id": "projectName",
  "source_type": "local_file",
  "asset_role": "logo_source|product_source|packaging_source|etc",
  "filename": "uploaded_name",
  "local_path": "/absolute/path",
  "use_as_source_of_truth": true/false,
  "use_as_reference_only": true/false,
  "status": "active",
  "created_at": "ISO-8601"
}
```

**Called By**:
- Media Manager upload interface
- Drag-drop file handling in UI

---

### 4. MEDIA TREE & REGISTRY DISCOVERY

#### Endpoint: `GET /media-manager/project/:project`
**Backend**: `buildMediaManagerProjectPayload(projectName)` → [server.js#L3380](runtime/orchestrator-service/server.js#L3380)

**Reads From**:
```javascript
// Check for project profile
if (fs.existsSync(/opt/mh-assistant/data/projects/<projectName>/project.json)):
  hasProfile = true
  baseDir = /opt/mh-assistant/data/projects/<projectName>/brand-assets
else:
  hasProfile = false
  baseDir = /opt/mh-assistant/data/brand-assets/<projectName>

// Always reads media tree from active baseDir:
- <baseDir>/logo/*
- <baseDir>/product/*
- <baseDir>/packaging/*
- <baseDir>/reference/*
- <baseDir>/video/*
- <baseDir>/media-input-registry.json
```

**Called By**:
- Frontend: `fetchAllCoreProjectData()` → [api.js#L119](public/control-center/api.js#L119)
- Control Center dashboard initialization
- Media Library page load

---

### 5. GENERATED CONTENT OUTPUT (ALWAYS LEGACY)

#### Render Operations
**Functions**:
- `markRenderResult(projectName, renderId, status, resultData)` → [server.js#L2774](runtime/orchestrator-service/server.js#L2774)
- `getLatestRenderRequest(projectName)` → [server.js#L556](runtime/orchestrator-service/server.js#L556)

**Writes To** (LOCKED TO LEGACY):
| Path | Content | When |
|------|---------|------|
| `/opt/mh-assistant/data/brand-assets/<projectName>/generated/renders/<renderId>.json` | Render job record | After execution |
| `/opt/mh-assistant/data/brand-assets/<projectName>/generated/outputs/<image>.png` | Generated image | After AI provider returns |

**Reads From**:
| Path | Purpose |
|------|---------|
| `/opt/mh-assistant/data/brand-assets/<projectName>/generated/renders/` | Find latest render |
| `/opt/mh-assistant/data/brand-assets/<projectName>/generated/outputs/` | Get latest output |

**Called By**:
- `executeProviderRender()` - calls markRenderResult
- Render status polling
- Render result retrieval

---

### 6. EMAIL PREPARATION & DELIVERY

#### Email Prepare Package
**Function**: `autoPrepareEmailAsset(projectName, rawText)` → [server.js#L328](runtime/orchestrator-service/server.js#L328)

**Writes To** (LOCKED TO LEGACY):
| Path | Content |
|------|---------|
| `/opt/mh-assistant/data/brand-assets/<projectName>/email-prepare-package.json` | Main prepare config |
| `/opt/mh-assistant/data/brand-assets/<projectName>/email/html/emailprep_<timestamp>.html` | Generated HTML |
| `/opt/mh-assistant/data/brand-assets/<projectName>/email/prepared/emailprep_<timestamp>.json` | Prepared package JSON |

**Reads From**:
| Path | Purpose |
|------|---------|
| `/opt/mh-assistant/data/brand-assets/<projectName>/generated/outputs/<image>` | Get rendered image |
| Logo source from brand context | Email branding |

**Called By**:
- POST `/media-manager/project/:project/email/prepare`
- Campaign email auto-setup workflows

---

### 7. CHANNEL EXECUTION PACKAGES (ALWAYS LEGACY)

#### Meta (Instagram/Facebook)
**Function**: `buildMetaPackage(projectName, placement, goal)` → [server.js#L1200](runtime/orchestrator-service/server.js#L1200)

**Writes To**:
```
/opt/mh-assistant/data/brand-assets/<projectName>/channels/meta/packages/
  ├── metapkg_<timestamp>.json
```

**Content**: Campaign metadata, captions, compliance checks, image references

---

#### TikTok
**Function**: `buildTikTokPackage(projectName, goal)` → [server.js#L1293](runtime/orchestrator-service/server.js#L1293)

**Writes To**:
```
/opt/mh-assistant/data/brand-assets/<projectName>/channels/tiktok/
  ├── ttpkg_<timestamp>.json
```

---

#### YouTube
**Function**: `buildYouTubePackage(projectName, format, goal)` → [server.js#L1423](runtime/orchestrator-service/server.js#L1423)

**Writes To**:
```
/opt/mh-assistant/data/brand-assets/<projectName>/channels/youtube/
  ├── ytpkg_<timestamp>.json
```

---

#### Amazon/eBay Marketplace
**Functions**: `buildAmazonPackage()`, `buildEbayPackage()` → [server.js#L1562](runtime/orchestrator-service/server.js#L1562)

**Writes To**:
```
/opt/mh-assistant/data/brand-assets/<projectName>/channels/marketplace/
  ├── amazon/amzpkg_<timestamp>.json
  ├── ebay/ebaypkg_<timestamp>.json
```

---

### 8. SCHEDULED PUBLISHING JOBS

#### Function: `upsertScheduledJob(projectName, input, options)` → [server.js#L2248](runtime/orchestrator-service/server.js#L2248)

**Path Resolution**:
```javascript
const filePath = getPublishingJobFilePath(projectName, jobId)
  → calls getLaunchOpsPaths(projectName)
  → returns /opt/mh-assistant/data/brand-assets/<projectName>/launch-ops/scheduler/
```

**Writes To** (LOCKED TO LEGACY):
| Path | Content |
|------|---------|
| `/opt/mh-assistant/data/brand-assets/<projectName>/launch-ops/scheduler/<jobId>.json` | Job record |

**Called By**:
- POST `/media-manager/project/:project/publishing/schedule`
- Publishing scheduler workflow
- Endpoint: [server.js#L6745](runtime/orchestrator-service/server.js#L6745)

---

### 9. CAMPAIGN & CONTENT MANAGEMENT

#### Campaigns (imported from backbone module)
**Function**: `upsertCampaign(projectName, campaignData)` → from lib/ops/backbone

**Writes To** (PRIMARY):
| Path | Content |
|------|---------|
| `/opt/mh-assistant/data/projects/<projectName>/campaigns/<campaignId>.json` | Campaign record |
| `/opt/mh-assistant/data/projects/<projectName>/campaigns/campaigns.json` | Campaign index |

**Endpoints**:
- POST `/media-manager/project/:project/campaigns`
- PATCH `/media-manager/project/:project/campaigns/:campaignId`
- Location: [server.js#L5854-5893](runtime/orchestrator-service/server.js#L5854-5893)

---

#### Content Items (imported from backbone module)
**Function**: `upsertContentItem(projectName, contentData)` → from lib/ops/backbone

**Writes To** (PRIMARY):
| Path | Content |
|------|---------|
| `/opt/mh-assistant/data/projects/<projectName>/content/<contentId>.json` | Content record |
| `/opt/mh-assistant/data/projects/<projectName>/content/content.json` | Content index |

**Endpoints**:
- POST `/media-manager/project/:project/content-items`
- PATCH `/media-manager/project/:project/content-items/:contentId`
- Location: [server.js#L5919-5965](runtime/orchestrator-service/server.js#L5919-5965)

---

### 10. TASKS, APPROVALS & OPERATIONS (PRIMARY)

#### Backbone Operations
**Functions** (from lib/ops/backbone):
- `createTask()`, `listTasks()`, `getTask()`
- `createApproval()`, `listApprovals()`, `decideApproval()`
- `recordWorkflowRun()`, `listWorkflowRuns()`
- `createAiArtifact()`, `listAiArtifacts()`, `getAiCommandRecord()`

**Writes To** (PRIMARY):
```
/opt/mh-assistant/data/projects/<projectName>/
├── tasks/
├── approvals/
├── workflow-runs/
├── ai-commands/
└── ai-artifacts/
```

**Endpoints**:
- GET/POST `/media-manager/project/:project/tasks`
- GET/POST `/media-manager/project/:project/approvals`
- GET/POST `/media-manager/project/:project/ai/commands`
- GET/POST `/media-manager/project/:project/ai/artifacts`

---

## EXACT OVERLAP ANALYSIS

### Shared File Paths

#### 1. Media Input Registry
**Paths**:
- **Primary**: `/opt/mh-assistant/data/projects/<projectName>/brand-assets/media-input-registry.json`
- **Legacy**: `/opt/mh-assistant/data/brand-assets/<projectName>/media-input-registry.json`

**Used By**:
- `buildLegacyMediaRegistry()` [server.js#L3309](runtime/orchestrator-service/server.js#L3309)
- `findRegisteredMediaFilePath()` [server.js#L3343](runtime/orchestrator-service/server.js#L3343)
- `resolveMediaFilePath()` for file lookup
- Media upload handlers

**Read/Write Mode**: DUAL - reads from whichever exists, writes depend on mode

---

#### 2. Brand Profile
**Paths**:
- **Legacy**: `/opt/mh-assistant/data/brand-assets/<projectName>/brand-profile.json`
- **Primary**: No equivalent in projects (project.json is structural, not brand profile)

**Used By**:
- Build brand context functions
- Legacy media tree building

**Status**: LEGACY ONLY - no primary equivalent yet

---

#### 3. Generated Assets
**Paths**:
- **Location**: `/opt/mh-assistant/data/brand-assets/<projectName>/generated/`

**Subdirectories**:
```
generated/
├── outputs/       ← Final rendered images
├── renders/       ← Render job records
└── jobs/          ← Render job definitions
```

**Used By**:
- All render operations
- Email preparation
- Channel package building
- Asset retrieval endpoints

**Status**: ALWAYS LEGACY - core production output repository

---

### No Direct Overlap
- **Projects** metadata: `/opt/mh-assistant/data/projects/registry.json` (PRIMARY only)
- **Project structure**: `/opt/mh-assistant/data/projects/<projectName>/` (PRIMARY only)
- **Campaigns/Content**: `/opt/mh-assistant/data/projects/<projectName>/` (PRIMARY only)
- **Tasks/Approvals**: `/opt/mh-assistant/data/projects/<projectName>/` (PRIMARY only)

---

## PRIMARY vs FALLBACK DETERMINATION

### Matrix: Which Root is Active

| Condition | Media Storage | Registry | Operations | Output |
|-----------|---|---|---|---|
| **project.json exists** | `/data/projects/.../brand-assets` (PRIMARY) | `/data/projects/.../media-input-registry.json` OR `/data/brand-assets/...` (checks both, prefers primary) | `/data/projects/...` (PRIMARY) | `/data/brand-assets/.../generated` (ALWAYS LEGACY) |
| **project.json missing** | `/data/brand-assets/<project>` (LEGACY) | `/data/brand-assets/.../media-input-registry.json` (LEGACY) | N/A (no project operations) | `/data/brand-assets/.../generated` (ALWAYS LEGACY) |

### Code Implementation
```javascript
// getProjectBrandPaths() - Line 3170
if (fs.existsSync(projectBase.projectFilePath)) {
  baseDir = projectBase.brandAssetsDir;  // /data/projects/<proj>/brand-assets
  mode = "primary";
} else {
  baseDir = legacyBaseDir;  // /data/brand-assets/<proj>
  mode = "legacy";
}

// resolveUploadTarget() - Line 68
if (legacyRole && fs.existsSync(LEGACY_BRAND_ASSETS_DIR + project)) {
  return { mode: "legacy_media", dir: legacyDir };
} else if (fs.existsSync(projectFilePath)) {
  return { mode: "project_catalog", dir: projectDir };
} else {
  return { mode: "legacy_media" };
}
```

---

## PATHS THAT STILL DEPEND ON BRAND-ASSETS

### 1. **Generated Content** (LOCKED)
```
/opt/mh-assistant/data/brand-assets/<projectName>/
├── generated/
│   ├── outputs/          ← Final AI-rendered images
│   ├── renders/          ← Render job records
│   └── jobs/             ← Job definitions
```
**Why**: Production output repository for AI-generated content  
**Migration Status**: ARCHITECTURAL DEPENDENCY (not scheduled for move)

---

### 2. **Channel Packages** (LOCKED)
```
/opt/mh-assistant/data/brand-assets/<projectName>/
├── channels/
│   ├── meta/packages/           ← Instagram/Facebook campaigns
│   ├── tiktok/                  ← TikTok packages
│   ├── youtube/                 ← YouTube packages
│   └── marketplace/
│       ├── amazon/              ← Amazon listings
│       └── ebay/                ← eBay listings
```
**Why**: Channel execution output repository  
**Migration Status**: ARCHITECTURAL DEPENDENCY (not scheduled for move)

---

### 3. **Email System** (LOCKED)
```
/opt/mh-assistant/data/brand-assets/<projectName>/
├── email/
│   ├── html/            ← Generated HTML emails
│   ├── prepared/        ← Prepared packages
│   └── delivery/        ← Delivery records
├── email-prepare-package.json
```
**Why**: Email preparation & delivery pipeline  
**Migration Status**: ARCHITECTURAL DEPENDENCY (not scheduled for move)

---

### 4. **Launch Operations** (LOCKED)
```
/opt/mh-assistant/data/brand-assets/<projectName>/
└── launch-ops/
    ├── scheduler/       ← Publishing job records
    └── connectors/      ← Channel connectors
```
**Why**: Publishing scheduler & connector repository  
**Migration Status**: ARCHITECTURAL DEPENDENCY (not scheduled for move)

---

### 5. **Brand Profile** (LEGACY)
```
/opt/mh-assistant/data/brand-assets/<projectName>/
├── brand-profile.json
└── [asset folders: logo, product, packaging, reference, video]
```
**Why**: Legacy brand asset metadata & source files  
**Migration Status**: OPTIONAL - can stay if not replacing with project.json

---

## SUMMARY TABLE

| Category | data/projects | data/brand-assets | Status |
|----------|---|---|---|
| **Metadata** | ✓ registry, project.json | - | PRIMARY |
| **Media Input** | ✓ NEW (assets-registry.json) | ✓ LEGACY (media-input-registry.json) | DUAL |
| **Media Storage** | ✓ NEW (in brand-assets subdir) | ✓ LEGACY | DUAL |
| **Generated Output** | - | ✓ ALWAYS | LOCKED |
| **Channel Packages** | - | ✓ ALWAYS | LOCKED |
| **Email System** | - | ✓ ALWAYS | LOCKED |
| **Publishing Jobs** | - | ✓ ALWAYS | LOCKED |
| **Campaigns/Content** | ✓ NEW | - | PRIMARY |
| **Tasks/Approvals** | ✓ NEW | - | PRIMARY |
| **AI Operations** | ✓ NEW | - | PRIMARY |

---

## MIGRATION ROADMAP

### Phase 1: ✓ COMPLETE
- Created `/opt/mh-assistant/data/projects/` structure
- Added `project.json` metadata files
- Created `brand-assets/` subdirs per project

### Phase 2: IN PROGRESS
- Routing new uploads to `data/projects/.../brand-assets/`
- Maintaining fallback to `data/brand-assets/` for legacy projects
- Dual-mode registry reading (assets-registry.json vs media-input-registry.json)

### Phase 3: NOT SCHEDULED
- **Keep** generated outputs in `data/brand-assets/.../generated/`
- **Keep** channel packages in `data/brand-assets/.../channels/`
- **Keep** email system in `data/brand-assets/.../email/`
- **Keep** publishing scheduler in `data/brand-assets/.../launch-ops/`

**Rationale**: These are production output repositories with complex dependencies across multiple systems. Moving them would require coordinating with:
- Email sender integration
- Publishing scheduler
- Channel API connectors
- Render pipeline
- AI orchestration

---

## API ENDPOINTS REFERENCE

### Media Management
- `GET /media/projects` - List projects (reads registry)
- `GET /media/tree/:project` - Get media tree (reads media tree)
- `POST /media/upload` - Upload media (writes dual-mode)
- `GET /media/registry/:project` - Get media registry (reads registry)
- `GET /media/file/:project/:type/:filename` - Retrieve file

### Dashboard
- `GET /media-manager/projects` - List media projects
- `GET /media-manager/project/:project` - Project dashboard (reads tree + registry)
- `GET /media-manager/project/:project/operations` - Operations snapshot
- `GET /media-manager/project/:project/campaigns` - List campaigns
- `GET /media-manager/project/:project/content-items` - List content
- `GET /media-manager/project/:project/tasks` - List tasks
- `GET /media-manager/project/:project/approvals` - List aapprovals

### Publishing
- `POST /media-manager/project/:project/publishing/schedule` - Schedule job (writes legacy)
- `POST /media-manager/project/:project/publishing/:jobId/publish` - Publish (writes legacy)

---

## FILE COUNTS BY CATEGORY

### Primary Root (`data/projects/`)
**Type**: Metadata, project structure, operations data  
**Read-Heavy**: YES  
**Write-Frequent**: Campaigns, tasks, approvals  
**Typical Size**: Small JSON files (< 1MB per project)

### Legacy Root (`data/brand-assets/`)
**Type**: Media assets, generated content, channel packages  
**Read-Heavy**: YES (especially generated/)  
**Write-Frequent**: Render jobs, channel packages, email records  
**Typical Size**: Large (50MB+ per project due to images/videos)

---

## CONSISTENCY NOTES

**⚠️ Important**: 
- Media registry can exist in both locations (file path is duplicated in `/data/projects/...` during new uploads)
- Always read from both locations and merge results
- Write decisions made by `resolveUploadTarget()` based on project.json existence
- Brand-assets is irreplaceable for generated content - no migration planned

