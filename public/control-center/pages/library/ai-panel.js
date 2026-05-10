export function renderLibraryAiPanel({ readiness = {}, selectedAsset = null } = {}) {
  const missingCount = readiness?.missingCount || 0;
  const selectedName = selectedAsset?.name || "No selected asset";

  return `
    <aside class="library-ai-panel" data-library-ai-panel>
      <div class="panel-card">
        <p class="eyebrow">AI Panel</p>
        <h3>Library AI Assistant</h3>
        <p class="muted">Context: ${selectedName}</p>
        <ul class="panel-list">
          <li>Missing categories: ${missingCount}</li>
          <li>Suggest classification for new assets</li>
          <li>Prepare prompt for AI Command</li>
        </ul>
        <button type="button" data-library-command="send-to-ai">Ask AI about Library</button>
      </div>
    </aside>
  `;
}
