# T185C.4A — AI Command Composer Icons + Voice Truth

## Status
Closed as UI cleanup / truth lock.

## Composer Icon Decision

The final AI Command composer uses:
- `+` for context attachment/source menu:
  - Upload file
  - Choose from Library
  - Choose product
  - Project context
- Specialist pill for AI Team / specialist selection.
- Mic icon for browser voice dictation.
- Send button for chat submission.

The separate source/sliders icon was removed from the final composer because it duplicated the `+` source/context menu.

## Voice Truth

### Ready now
Browser voice dictation is implemented through `SpeechRecognition` / `webkitSpeechRecognition` when supported by the browser and microphone permission is granted.

When recognition succeeds, the captured transcript is inserted into the AI Command composer.

### Not enabled in this phase
Full realtime voice conversation is not enabled in the final composer.

A full ChatGPT-like voice conversation mode still requires a provider-backed phase:
- recording state UI
- STT pipeline
- AI specialist response loop
- TTS playback
- permissions / browser compatibility handling
- cancellation / retry UX
- governance and execution boundaries

## Final UX Contract

- `+` opens context/source attachment.
- Mic starts browser dictation.
- Full voice conversation remains planned and must not be presented as production-ready until the provider-backed phase is implemented.

## Scope Guard

No backend changes.
No provider execution changes.
No route changes.
No governance changes.
No runtime data committed.
