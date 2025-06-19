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
      this.decorations = this.reconcileDecorations(view, Decoration.none);
    }

    update(update: ViewUpdate) {
      if (update.docChanged) {
        this.decorations = this.decorations.map(update.changes);
        this.decorations = this.reconcileDecorations(
          update.view,
          this.decorations,
        );
      }
    }

    reconcileDecorations(
      view: EditorView,
      existingDecorations: DecorationSet,
    ): DecorationSet {
      const existingDecorationsMap = new Map();
      existingDecorations.between(
        0,
        view.state.doc.length,
        (from, to, value) => {
          existingDecorationsMap.set(to, value);
        },
      );

      const doc = view.state.doc;
      const text = doc.toString();
      const regex = /\[\[(\d{4}-\d{2}-\d{2})(?:\|[^\]]+)?\]\]/g;
      const finalDecorations = [];
      let match;

      while ((match = regex.exec(text)) !== null) {
        const pos = match.index + match[0].length;

        if (existingDecorationsMap.has(pos)) {
          finalDecorations.push(existingDecorationsMap.get(pos).range(pos));
          existingDecorationsMap.delete(pos);
        } else {
          // Only do date math if we need to create new decoration
          const dateStr = match[1];
          if (!dateStr) continue;
          const [year, month, day] = dateStr.split('-').map(Number);
          if (!year || !month || !day) continue;

          const targetDate = new Date(year, month - 1, day);
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
          finalDecorations.push(widget.range(pos));
        }
      }

      return Decoration.set(finalDecorations);
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
