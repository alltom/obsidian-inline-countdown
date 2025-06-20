#!/usr/bin/env node

import 'dotenv/config';
import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const pluginDir = process.env.OBSIDIAN_PLUGIN_PATH;
if (!pluginDir) {
  console.error('Please set OBSIDIAN_PLUGIN_PATH in .env file');
  process.exit(1);
}
mkdirSync(pluginDir, { recursive: true });

['main.js', 'manifest.json', 'styles.css'].forEach(file => {
  const src = join('build', file);
  const dest = join(pluginDir, file);
  copyFileSync(src, dest);
});

console.log('Deployed to', pluginDir);