# T181-I3 — AI Command Voice Modes Architecture Plan

## Status
Plan only. No runtime implementation in this phase.

## Purpose
Define the final voice architecture for AI Command before implementing audio recording, backend STT, TTS, or realtime voice conversation.

## Current Completed Baseline
The current AI Command supports browser-based voice dictation:
- User selects Mic language: Auto / AR / EN / DE.
- User presses microphone.
- Browser SpeechRecognition listens.
- Recognized transcript is inserted into the composer.
- User sends the message to the selected AI specialist/team.

This is the baseline for voice input, not full voice conversation.

## Voice Modes

### Mode 1 — Browser Voice Dictation
Status: Implemented baseline.

Purpose:
- Fast local dictation into the composer.

Flow:
1. User selects Mic language.
2. User presses Mic.
3. Browser SpeechRecognition returns transcript.
4. Transcript fills composer.
5. User sends manually.

Risks:
- Browser-dependent.
- Not production-grade STT.
- No audio file retained.

### Mode 2 — Audio Recording
Status: Planned.

Purpose:
- Record an audio file as a message/source.

Flow:
1. User presses Record.
2. Browser MediaRecorder captures audio.
3. User stops/cancels recording.
4. Audio blob is shown as attachment.
5. User can send it to backend or attach to a source.

Needed:
- Recording state.
- Duration timer.
- Cancel/stop controls.
- Audio preview.
- File/object URL cleanup.
- Attachment metadata.

### Mode 3 — Backend Speech-to-Text
Status: Planned.

Purpose:
- Reliable production-grade transcription.

Flow:
1. Audio blob/file is sent to backend.
2. Backend routes audio to STT provider.
3. Transcript is returned with metadata.
4. Transcript is attached to chat/source history.
5. User can edit before sending to specialist.

Needed:
- Backend upload endpoint.
- Provider adapter.
- File size/type guard.
- Transcript response contract.
- Error handling.
- Governance/privacy handling.

### Mode 4 — Specialist Voice Reply
Status: Planned.

Purpose:
- Allow specialist response to be heard as audio.

Flow:
1. User sends text or transcript to specialist.
2. Specialist returns text response.
3. UI sends response text to TTS provider.
4. Audio response is returned/streamed.
5. User can play/pause/replay.

Needed:
- TTS provider adapter.
- Voice profile options.
- Audio playback UI.
- Persisted audio metadata.
- Cost/provider guard.

### Mode 5 — Full Voice Conversation
Status: Planned.

Purpose:
- Voice-in / text+voice-out conversation with chosen specialist.

Flow:
1. User chooses specialist.
2. User speaks.
3. STT creates transcript.
4. Transcript is sent to specialist.
5. Specialist returns text.
6. TTS generates voice response.
7. UI plays the response.
8. Chat history stores text transcript and audio metadata.

Needed:
- Conversation state.
- Turn handling.
- Mic start/stop.
- TTS playback.
- Governance confirmations for risky actions.
- Stop/cancel controls.

### Mode 6 — Realtime Voice Bridge
Status: Future.

Purpose:
- Low-latency live voice session.

Flow:
1. User starts realtime voice.
2. Browser streams audio.
3. Provider processes speech and model response in realtime.
4. Audio response streams back.
5. User can interrupt.

Needed:
- Realtime provider.
- Streaming/WebSocket transport.
- Audio input stream.
- Audio output stream.
- Interrupt support.
- Strong governance and session boundary.

## Recommended Implementation Order
1. Close browser dictation baseline.
2. Add UI-only Voice Mode menu, no backend.
3. Add Audio Recording local blob mode.
4. Add backend STT endpoint.
5. Add transcript-to-specialist handoff.
6. Add TTS playback for specialist responses.
7. Add full voice conversation.
8. Evaluate realtime voice bridge.

## Governance Rules
- Voice commands must never execute risky operations directly.
- Spoken commands can draft, prepare, analyze, or route.
- Execution requires explicit confirmation.
- Audio/transcript should be treated as source material with privacy rules.
- Provider use should be logged when backend integrations are active.

## UI Direction
AI Command should expose:
- Mic language selector.
- Mic dictation button.
- Voice mode button.
- Recording state when active.
- Audio attachment preview.
- TTS playback controls inside assistant response bubbles.
- Clear labels: Dictation, Recording, Voice conversation.

## Commit Boundary
This plan is documentation only and should be committed separately from runtime data files.
