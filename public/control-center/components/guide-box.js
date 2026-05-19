// Reusable Guide Box Component
// Usage: renderGuideBox({ title, instructions, actions, tone })
export function renderGuideBox({
  title = "Guide",
  instructions = "",
  actions = [],
  tone = "info",
  sourceTypes = []
} = {}) {
  const safeTitle = escapeHtml(title);
  const safeInstructions = Array.isArray(instructions)
    ? `<ol>${instructions.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`
    : `<div>${escapeHtml(String(instructions))}</div>`;
  const safeActions = Array.isArray(actions) && actions.length
    ? `<div class="mhos-guide-box-actions">${actions.map(action => `<button class="btn btn-primary mhos-guide-box-action" type="button" data-guide-action="${escapeHtml(action.id)}">${escapeHtml(action.label)}</button>`).join("")}</div>`
    : "";
  const safeSourceTypes = Array.isArray(sourceTypes) && sourceTypes.length
    ? `<div class="mhos-guide-box-sourcetypes">${sourceTypes.map(type => `<span class="mhos-guide-box-chip" data-guide-sourcetype="${escapeHtml(type.key)}">${escapeHtml(type.label)}</span>`).join("")}</div>`
    : "";
  return `
    <aside class="mhos-guide-box mhos-guide-box-tone-${escapeHtml(tone)}" role="region" aria-label="${safeTitle}">
      <div class="mhos-guide-box-head">
        <strong>${safeTitle}</strong>
      </div>
      <div class="mhos-guide-box-body">
        <div class="mhos-guide-box-instructions">${safeInstructions}</div>
        ${safeSourceTypes}
        ${safeActions}
      </div>
    </aside>
  `;
}

// Helper for HTML escaping
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]);
  });
}
