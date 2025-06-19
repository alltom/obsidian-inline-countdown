import { Plugin } from 'obsidian';
import { ViewPlugin, EditorView, ViewUpdate, Decoration, DecorationSet, WidgetType } from '@codemirror/view';

const dateCountdownViewPlugin = ViewPlugin.fromClass(class {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		this.decorations = this.buildDecorations(update.view);
	}

	buildDecorations(view: EditorView): DecorationSet {
		const doc = view.state.doc;
		const text = doc.toString();
		const regex = /\[\[(\d{4}-\d{2}-\d{2})(?:\|[^\]]+)?\]\]/g;
		const decorations = [];
		let match;
		
		while ((match = regex.exec(text)) !== null) {
			const from = match.index;
			const to = match.index + match[0].length;
			
			const dateStr = match[1];
			const targetDate = new Date(dateStr);
			const now = new Date();
			const diffTime = targetDate.getTime() - now.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			
			const widget = Decoration.widget({
				widget: new (class extends WidgetType {
					toDOM() {
						const span = document.createElement('span');
						span.textContent = diffDays === 0 ? ` (today)` : ` (${diffDays} days)`;
						span.className = 'inline-countdown';
						return span;
					}
				})()
			});
			
			decorations.push(widget.range(to));
		}
		
		return Decoration.set(decorations);
	}
}, {
	decorations: v => v.decorations
});

export default class InlineCountdownPlugin extends Plugin {
	async onload() {
			
		this.registerEditorExtension(dateCountdownViewPlugin);
	}

	onunload() {
		}
}