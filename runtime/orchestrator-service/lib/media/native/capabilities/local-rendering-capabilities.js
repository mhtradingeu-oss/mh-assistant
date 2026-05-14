'use strict';

const { execFileSync } = require('child_process');

function commandExists(command) {
  try {
    execFileSync('which', [command], { stdio: 'ignore' });
    return true;
  } catch (_error) {
    return false;
  }
}

function tryCommand(command, args = []) {
  try {
    return String(execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })).trim();
  } catch (_error) {
    return '';
  }
}

function getLocalRenderingCapabilities() {
  const hasNvidiaSmi = commandExists('nvidia-smi');
  const hasFfmpeg = commandExists('ffmpeg');
  const hasPython = commandExists('python3');
  const hasNode = commandExists('node');

  return {
    gpu: {
      nvidia_available: hasNvidiaSmi,
      summary: hasNvidiaSmi ? tryCommand('nvidia-smi', ['--query-gpu=name,memory.total', '--format=csv,noheader']) : ''
    },
    tools: {
      ffmpeg: hasFfmpeg,
      python3: hasPython,
      node: hasNode
    },
    local_rendering: {
      image: hasNvidiaSmi,
      video: hasNvidiaSmi && hasFfmpeg,
      audio: hasPython && hasFfmpeg,
      voice_chat: hasPython && hasFfmpeg
    },
    recommendation: hasNvidiaSmi
      ? 'Local rendering can be connected with proper model runtimes.'
      : 'No GPU detected. Keep native runtime ready, but use external GPU worker or dedicated rendering server for real image/video generation.'
  };
}

module.exports = {
  getLocalRenderingCapabilities
};
