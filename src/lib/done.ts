// The panel that appears after a save: what was saved, a way to save it again, and the next step.
import { nextTools } from './route';
import { handOff } from './handoff';

export function showDone(o: {
  el: HTMLElement;
  slug: string;
  line: string;
  again: () => void;
  /** The saved file, when there is exactly one, so a next tool can pick it up. */
  result?: File;
  /** Only for tools without their own Start over button. */
  reset?: () => void;
}) {
  const next = o.result ? nextTools(o.slug) : [];
  o.el.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'done-line';
  p.textContent = `${o.line} Look in your Downloads folder.`;
  const row = document.createElement('div');
  row.className = 'done-row';
  const btn = (label: string, cls: string, fn: () => void) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = label; b.onclick = fn;
    return b;
  };
  row.append(btn('Save again', 'link', o.again));
  if (next.length) {
    const lab = document.createElement('span');
    lab.className = 'done-next';
    lab.textContent = 'Next, with this file:';
    row.append(lab, ...next.map((r) => btn(r.label, 'chip', () => handOff([o.result!], r.slug))));
  }
  if (o.reset) row.append(btn('Start over', 'link', () => { o.el.hidden = true; o.reset!(); }));
  o.el.append(p, row);
  o.el.hidden = false;
}

export const hideDone = (el: HTMLElement | null) => { if (el) el.hidden = true; };
