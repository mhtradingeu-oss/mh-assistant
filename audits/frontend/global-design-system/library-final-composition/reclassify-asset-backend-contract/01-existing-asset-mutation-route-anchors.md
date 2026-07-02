# 01 — Existing Asset Mutation Route Anchors

Generated: Sat Jun  6 13:44:58 CEST 2026

## Route lines
10805:app.post('/media-manager/project/:project/assets/:assetId/status', express.json({ limit: '1mb' }), (req, res) => {
10859:app.post('/media-manager/project/:project/assets/:assetId/rename', express.json({ limit: '1mb' }), (req, res) => {
10889:app.post('/media-manager/project/:project/assets/:assetId/source-of-truth', express.json({ limit: '1mb' }), (req, res) => {
10914:app.post('/media-manager/project/:project/assets/:assetId/archive', express.json({ limit: '1mb' }), (req, res) => {
10942:app.post('/media-manager/project/:project/assets/:assetId/delete', express.json({ limit: '1mb' }), (req, res) => {
11004:app.post('/media-manager/project/:project/library/refresh', (req, res) => {

## Existing route implementation excerpt
    project,
    assetId,
    matched,
    registryPath,
    updated_at: now
  };
}

function sendAssetMutationError(res, error, fallbackMessage) {
  const statusCode = Number(error?.statusCode || 0);
  const payload = {
    error: error?.message || fallbackMessage,
    ...(error?.details && typeof error.details === 'object' ? error.details : {})
  };

  if (statusCode >= 400 && statusCode < 600) {
    return res.status(statusCode).json(payload);
  }

  return res.status(500).json({
    error: fallbackMessage,
    details: error?.message || String(error)
  });
}

app.post('/media-manager/project/:project/assets/:assetId/status', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const status = String(req.body?.status || '').trim().toLowerCase();
    const note = String(req.body?.note || '').trim();

    const allowed = new Set(['approved', 'needs_review', 'rejected', 'archived']);
    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    if (!allowed.has(status)) {
      return res.status(400).json({
        error: 'Invalid status.',
        allowed: Array.from(allowed)
      });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.status = status;
      asset.readiness_status = status;
      asset.review_status = status;
      asset.needs_review = status === 'needs_review';
      asset.approved = status === 'approved';
      asset.rejected = status === 'rejected';
      asset.archived = status === 'archived';
      asset.reviewed_at = now;
      asset.reviewed_by = 'control_center';

      if (status === 'approved') {
        asset.approved_at = now;
        asset.approval_note = note || asset.approval_note || 'Approved from Control Center Library.';
      }

      if (status === 'rejected') {
        asset.rejected_at = now;
        asset.rejection_note = note || asset.rejection_note || 'Rejected from Control Center Library.';
      }

      if (status === 'archived') {
        asset.archived_at = now;
        asset.archive_note = note || asset.archive_note || 'Archived from Control Center Library.';
      }
    });

    return res.json({
      ...result,
      status
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to update asset status.');
  }
});

app.post('/media-manager/project/:project/assets/:assetId/rename', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const name = String(req.body?.name || req.body?.display_name || '').trim();

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Missing asset name.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.name = name;
      asset.title = name;
      asset.display_name = name;
      asset.renamed_at = now;
      asset.renamed_by = 'control_center';
    });

    return res.json({
      ...result,
      name
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to rename asset.');
  }
});

app.post('/media-manager/project/:project/assets/:assetId/source-of-truth', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const sourceOfTruth = Boolean(req.body?.source_of_truth);

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.source_of_truth = sourceOfTruth;
      asset.use_as_source_of_truth = sourceOfTruth;
      asset.source_of_truth_updated_at = now;
      asset.source_of_truth_updated_by = 'control_center';
    });

    return res.json({
      ...result,
      source_of_truth: sourceOfTruth
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to update source of truth.');
  }
});

app.post('/media-manager/project/:project/assets/:assetId/archive', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const note = String(req.body?.note || '').trim();

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.status = 'archived';
      asset.readiness_status = 'archived';
      asset.review_status = 'archived';
      asset.archived = true;
      asset.archived_at = now;
      asset.archive_note = note || asset.archive_note || 'Archived from Control Center Library.';
      asset.reviewed_by = 'control_center';
    });

    return res.json({
      ...result,
      status: 'archived'
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to archive asset.');
  }
});

app.post('/media-manager/project/:project/assets/:assetId/delete', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const note = String(req.body?.note || '').trim();

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.deleted = true;
      asset.deleted_at = now;
      asset.deleted_by = 'control_center';
      asset.delete_note = note || asset.delete_note || 'Soft deleted from Control Center Library.';
      asset.status = 'archived';
      asset.readiness_status = 'archived';
      asset.review_status = 'archived';
      asset.archived = true;
      asset.archived_at = asset.archived_at || now;
    });

    return res.json({
      ...result,
      deleted: true,
      status: 'archived'
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to delete asset.');
  }
});

app.delete('/media-manager/project/:project/assets/:assetId', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const note = String(req.body?.note || '').trim();

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.deleted = true;
      asset.deleted_at = now;
      asset.deleted_by = 'control_center';
      asset.delete_note = note || asset.delete_note || 'Soft deleted from Control Center Library.';
      asset.status = 'archived';
      asset.readiness_status = 'archived';
      asset.review_status = 'archived';
      asset.archived = true;
      asset.archived_at = asset.archived_at || now;
    });

    return res.json({
      ...result,
