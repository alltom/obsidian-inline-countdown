import {Plugin} from 'obsidian';
import {
  ViewPlugin,
  EditorView,
  ViewUpdate,
  Decoration,
  DecorationSet,
  WidgetType,
} from '@codemirror/view';
import {formatSemanticDuration} from './dateFormat';

const dateCountdownViewPlugin = ViewPlugin.fromClass(
  class {
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
        const to = match.index + match[0].length;

        const dateStr = match[1];
        if (!dateStr) continue;
        // Parse as local timezone by splitting the date parts
        const [year, month, day] = dateStr.split('-').map(Number);
        if (!year || !month || !day) continue;
        const targetDate = new Date(year, month - 1, day); // month is 0-indexed
        const now = new Date();
        const durationText = formatSemanticDuration(targetDate, now);

        const widget = Decoration.widget({
          widget: new (class extends WidgetType {
            toDOM() {
              const span = document.createElement('span');
              span.textContent = ` (${durationText})`;
              span.className = 'inline-countdown';
              return span;
            }
          })(),
        });

        decorations.push(widget.range(to));
      }

      return Decoration.set(decorations);
    }
  },
  {
    decorations: v => v.decorations,
  },
);

export default class InlineCountdownPlugin extends Plugin {
  override async onload() {
    this.registerEditorExtension(dateCountdownViewPlugin);
  }

  override onunload() {}
}
