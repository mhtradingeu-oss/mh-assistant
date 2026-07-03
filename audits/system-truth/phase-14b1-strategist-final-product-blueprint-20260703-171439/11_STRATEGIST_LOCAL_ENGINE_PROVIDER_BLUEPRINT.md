# Strategist Local Engine / Provider Blueprint

## Principle

Local/internal first.

Paid provider only when needed and user-approved.

## Strategist local capabilities

Strategist can run with:

- local LLM through local provider layer
- project RAG over brand/product/campaign docs
- local embeddings
- local keyword clustering
- local CSV/performance summary
- local document extraction
- local competitor note analysis if files are uploaded

## Internal engines needed

| Engine | Purpose |
|---|---|
| Strategy brief builder | Turn task packet into Campaign Brief |
| Missing context detector | Identify gaps |
| Audience mapper | Build audience segments |
| Offer angle generator | Create commercial angles |
| Channel planner | Suggest channel mix |
| Handoff packet builder | Prepare team handoff |
| Evidence router | Attach sources used |

## Open-source/local provider candidates

- Ollama
- llama.cpp
- local embeddings
- local vector store
- local document parser
- CSV analyzer
- keyword clustering utilities

## Paid providers optional

- OpenAI
- Anthropic
- Google
- Mistral
- Perplexity/search provider for external research if enabled

## Provider control

User settings should support:

- Local only
- Local first
- Ask before paid provider
- Allow paid provider for high-quality strategy

## No hidden execution

Strategist must not silently:

- call paid providers
- run external research
- publish
- mutate backend data
- launch workflows
