# Native Media Provider Execution Router

Routes native media jobs to provider execution adapters.

Current routing:
- openai/image -> OpenAI image adapter
- openai/voice_chat -> OpenAI realtime placeholder
- native/* -> external GPU worker adapter
- unknown providers -> missing_adapter

Purpose:
- avoid hardcoded provider execution inside orchestrator
- centralize execution routing
- support future Google Nano Banana, Veo, Runway, Kling, Pika adapters
