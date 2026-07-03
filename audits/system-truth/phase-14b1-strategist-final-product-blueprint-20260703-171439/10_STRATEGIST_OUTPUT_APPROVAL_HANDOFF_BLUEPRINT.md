
Strategist Output / Approval / Handoff Blueprint
Primary output

Approved Campaign Brief.

Campaign Brief sections
Campaign objective
Audience segments
Key insight
Positioning
Offer angles
Message pillars
Channel mix
Launch phases
Creative direction
Required assets
Compliance notes
Risks / blockers
Next best actions
Team handoffs
Preview states
State	Meaning
Draft	AI generated but not reviewed
Needs context	Important fields missing
Ready for review	Complete enough for user review
Approved	User approved strategy brief
Handed off	Sent to next specialist/workspace
User actions
Edit section
Regenerate section
Ask follow-up
Approve Brief
Send to Writer
Send to Media Director
Send to Video Lead
Send to Compliance
Send to Publisher
Send to Operations
Open in Campaign Studio
Handoff packet

Every handoff should include:

source specialist: Strategist
approved brief id/title
summary
relevant sections
constraints
destination specialist
destination route
approval state
source project
timestamp
Handoff destinations
Destination	Purpose
Writer	Copy, scripts, captions, email
Media Director	Visual direction and assets
Video Lead	Storyboard and video prompts
Compliance Reviewer	Claims and risk review
Publisher	Publishing package
Ads Optimizer	Paid campaign structure
Operations Lead	Tasks and workflow plan
Workflows	Multi-step execution planning
EOF	
cat "$AUDIT_DIR/10_STRATEGIST_OUTPUT_APPROVAL_HANDOFF_BLUEPRINT.md"	

echo ""
echo "===== 11) LOCAL ENGINE / PROVIDER BLUEPRINT ====="
cat > "$AUDIT_DIR/11_STRATEGIST_LOCAL_ENGINE_PROVIDER_BLUEPRINT.md" <<'EOF'

Strategist Local Engine / Provider Blueprint
Principle

Local/internal first.

Paid provider only when needed and user-approved.

Strategist local capabilities

Strategist can run with:

local LLM through local provider layer
project RAG over brand/product/campaign docs
local embeddings
local keyword clustering
local CSV/performance summary
local document extraction
local competitor note analysis if files are uploaded
Internal engines needed
Engine	Purpose
Strategy brief builder	Turn task packet into Campaign Brief
Missing context detector	Identify gaps
Audience mapper	Build audience segments
Offer angle generator	Create commercial angles
Channel planner	Suggest channel mix
Handoff packet builder	Prepare team handoff
Evidence router	Attach sources used
Open-source/local provider candidates
Ollama
llama.cpp
local embeddings
local vector store
local document parser
CSV analyzer
keyword clustering utilities
Paid providers optional
OpenAI
Anthropic
Google
Mistral
Perplexity/search provider for external research if enabled
Provider control

User settings should support:

Local only
Local first
Ask before paid provider
Allow paid provider for high-quality strategy
No hidden execution

Strategist must not silently:

call paid providers
run external research
publish
mutate backend data
launch workflows
