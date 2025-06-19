import { Plugin } from 'obsidian';

export default class InlineCountdownPlugin extends Plugin {
	async onload() {
		console.log('Inline Countdown plugin loaded');
	}

	onunload() {
		console.log('Inline Countdown plugin unloaded');
	}
}