# Native Media Worker Adapters

Worker adapters allow MH-OS to offload heavy rendering to another machine.

Current worker:
- external-gpu-worker-adapter.js

Purpose:
- keep MH-OS on a lightweight server
- send heavy image/video/audio rendering to GPU workers later
- avoid installing large AI models on the main control server
