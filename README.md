# Inline Countdown

An Obsidian plugin that displays inline countdowns and countups for date links in preview mode.

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
- Copy or symlink `main.js`, `styles.css`, and `manifest.json` to your vault's plugins folder
- Reload Obsidian to see changes

## Distribution

Run `npm run package` to create `build/obsidian-inline-countdown.zip` containing the three files needed for plugin installation.
