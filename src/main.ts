import {Plugin} from 'obsidian';
import {
  ViewPlugin,
  EditorView,
  ViewUpdate,
  Decoration,
  DecorationSet,
  WidgetType,
} from '@codemirror/view';
import {formatSemanticDuration, classifyDueDate} from './dateFormat';
import {dateFromJsDate} from './simpleDate';
import {findDatesInText} from './dateParsing';

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
      const dateMatches = findDatesInText(text);
      const finalDecorations = [];

      for (const dateMatch of dateMatches) {
        const pos = dateMatch.endIndex;

        if (existingDecorationsMap.has(pos)) {
          finalDecorations.push(existingDecorationsMap.get(pos).range(pos));
          existingDecorationsMap.delete(pos);
        } else {
          // Only do date math if we need to create new decoration
          const targetDate = dateMatch.date;
          const now = dateFromJsDate(new Date());
          const durationText = formatSemanticDuration(targetDate, now);

          let cssClass = 'inline-countdown';
          if (dateMatch.isDueDate) {
            const status = classifyDueDate(targetDate, now);
            cssClass += ` inline-countdown-${status}`;
          }

          const widget = Decoration.widget({
            widget: new (class extends WidgetType {
              toDOM() {
                const span = document.createElement('span');
                span.textContent = ` (${durationText})`;
                span.className = cssClass;
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
