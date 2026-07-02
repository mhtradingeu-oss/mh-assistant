# Native Media Capability Detection

Detects whether this server can run real local rendering.

Current checks:
- NVIDIA GPU availability
- ffmpeg availability
- Python availability
- Node availability

This layer helps MH-OS decide whether to:
- run local rendering
- use an external GPU worker
- use optional provider adapters
- keep jobs in not_configured state
