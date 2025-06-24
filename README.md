# Inline Countdown

An Obsidian plugin that displays inline countdowns and countups for date links in live preview mode.

## Features

- Detects date links in the format `[[YYYY-MM-DD]]`
- Detects Tasks plugin due dates in the format `📅 YYYY-MM-DD`
- In [live preview](https://help.obsidian.md/edit-and-read#Live+Preview), shows live countdown timers for future dates
- Shows countups for dates in the past

## Usage

Create date links in your notes using either format. In live preview, these will show countdown timers displaying the time remaining until (or since) that date.

Examples:

- `[[2024-12-25]]` - Shows countdown to Christmas, 2025
- `📅 2025-06-20` - Shows countdown to June 20, 2025
- `[[2020-01-01]]` - Shows time elapsed since the year 2020 began

## Development

- Clone this repo
- `npm install` to install dependencies
- `npm run dev` to start compilation in watch mode
- `npm run test` to run tests (compiles first, then runs tests and linting)
- `npm run lint` to check code style
- `npm run fix` to auto-fix linting issues

### Local Deployment

To deploy to your Obsidian vault during development:

1. Create a `.env` file with your plugin directory path:
   ```
   OBSIDIAN_PLUGIN_PATH=/path/to/your/vault/.obsidian/plugins/obsidian-inline-countdown
   ```
2. Run `npm run build` to compile the plugin
3. Run `npm run deploy_local` to copy files to your vault's plugins directory
4. Reload Obsidian to see changes

Alternatively, copy or symlink `main.js`, `styles.css`, and `manifest.json` from the `build/` directory to your vault's plugins folder manually.

## Distribution

Run `npm run package` to create `build/obsidian-inline-countdown.zip` containing the three files needed for plugin installation.
