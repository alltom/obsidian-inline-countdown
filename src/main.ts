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

        // Calculate what decoration should be
        const targetDate = dateMatch.date;
        const now = dateFromJsDate(new Date());
        const expectedText = ` (${formatSemanticDuration(targetDate, now)})`;

        let decorationToUse;

        if (existingDecorationsMap.has(pos)) {
          const existingDecoration = existingDecorationsMap.get(pos);
          const existingWidget = existingDecoration.spec?.widget;
          const existingElement = existingWidget?.toDOM?.();
          
          if (existingElement?.textContent === expectedText) {
            decorationToUse = existingDecoration;
          }
          existingDecorationsMap.delete(pos);
        }

        if (!decorationToUse) {
          let cssClass = 'inline-countdown';
          if (dateMatch.isDueDate) {
            const status = classifyDueDate(targetDate, now);
            cssClass += ` inline-countdown-${status}`;
          }

          decorationToUse = Decoration.widget({
            widget: new (class extends WidgetType {
              toDOM() {
                const span = document.createElement('span');
                span.textContent = expectedText;
                span.className = cssClass;
                return span;
              }
            })(),
          });
        }

        finalDecorations.push(decorationToUse.range(pos));
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
