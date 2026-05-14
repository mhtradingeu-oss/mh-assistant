'use strict';

const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeMediaOutput({ baseDir, project, jobId, filename, buffer }) {
  const safeProject = String(project || 'default').replace(/[^a-z0-9_-]/gi, '_');
  const safeJobId = String(jobId || `job_${Date.now()}`).replace(/[^a-z0-9_-]/gi, '_');
  const safeFilename = String(filename || 'output.bin').replace(/[^a-z0-9._-]/gi, '_');

  const outputDir = path.join(baseDir, 'data', 'projects', safeProject, 'media-outputs', safeJobId);
  ensureDir(outputDir);

  const outputPath = path.join(outputDir, safeFilename);
  fs.writeFileSync(outputPath, buffer);

  return {
    output_path: outputPath,
    relative_path: path.relative(baseDir, outputPath)
  };
}

module.exports = {
  writeMediaOutput
};
