**Obsidian-like Notes App Plan (Vault + CodeMirror, No Split View)**

**Core constraints**

- Notes are real `.md` files in a user-chosen **vault folder** (folders + files).
- **No split view**. Single pane: **Edit** mode and a **Preview toggle** (same pane).
- Secure Electron: renderer is sandboxed; **all filesystem + dialogs live in main**; renderer talks through **typed preload API** only.

---

## Phase 0 — Foundation (don’t skip)

1. **Lock the boundary (Electron fundamentals)**

- Main: vault path, filesystem, dialogs, indexing/search, file watching.
- Preload: minimal typed API via `contextBridge.exposeInMainWorld`.
- Renderer: React UI + CodeMirror state only.
- Done when: renderer never imports `fs`/Node; only uses `window.context.*`.

2. **Fix preload/renderer mismatch now**

- Your renderer utils already expect `window.context.locale`, but preload exposes `{}`.
- Define `Window.context` type + expose at least:
  - `locale: string`
  - `platform: 'win32' | 'darwin' | 'linux'`
- Done when: importing renderer utils cannot crash at runtime.

3. **Make the app usable for text**

- Adjust global CSS so selection + scrolling work in editor areas.
- Keep draggable header region only; don’t disable selection globally.
- Done when: you can select/copy text and scroll long content.

---

## Phase 1 — Vault (Obsidian core #1)

4. **Pick vault folder + persist**

- Main: `dialog.showOpenDialog({ properties: ['openDirectory'] })`
- Persist vault path in a JSON settings file under `app.getPath('userData')`.
- Preload API:
  - `vault.pick()`
  - `vault.get()`
  - `vault.set(path)`
- Done when: restart app and vault remains selected.

5. **File tree (folders + markdown files)**

- Main: `vault.listTree()` (or `vault.listDir(relPath)`) returning folders and `.md` files.
- Renderer: sidebar explorer (expand/collapse folders, click file to open).
- Done when: you can navigate folders and open notes.

---

## Phase 2 — Read/Write loop (Obsidian core #2)

6. **Secure path validation (must-have)**

- Every IPC request passes a _vault-relative path_.
- Main resolves it and rejects anything escaping the vault (`..`, symlinks if you handle them later).
- Done when: renderer cannot read/write outside vault.

7. **Implement note operations**
   Main IPC handlers (via `ipcMain.handle`):

- `notes.read(relPath) -> { content, stat }`
- `notes.write(relPath, content) -> { stat }`
- `notes.create({ folderRelPath, name }) -> { relPath }`
- `notes.rename(oldRelPath, newRelPath)`
- `notes.delete(relPath)`
- Done when: create → open → edit → save persists on disk.

8. **Basic UI workflow**

- Single editor pane, file title in header, sidebar tree left.
- “Dirty” indicator (`●`) when editor differs from last saved content.
- Start with manual save (`Ctrl/Cmd+S`), then add autosave.
- Done when: you can edit without losing work.

---

## Phase 3 — CodeMirror first-class editor (Obsidian feel)

9. **Integrate CodeMirror 6 (React)**

- Use CodeMirror 6 with:
  - Markdown language support
  - history (undo/redo)
  - search (`Ctrl/Cmd+F`)
  - keymaps (default + custom)
  - line wrapping toggle (optional)
- Keep editor state in renderer; saving still goes through IPC.
- Done when: editing feels fast and stable on large notes.

10. **Link intelligence (Obsidian-like)**

- Detect wiki links `[[Like This]]` in CodeMirror:
  - Ctrl/Cmd+click opens that note (by title match or file match)
  - Autocomplete when typing `[[` (suggest note titles/paths)
- Main maintains an index of notes (title ↔ relPath).
- Done when: linking between notes is frictionless.

11. **Editor niceties that matter**

- Markdown shortcuts: `Ctrl/Cmd+B` bold, `Ctrl/Cmd+I` italic (can be implemented as text transforms).
- Indent/outdent list items with Tab/Shift+Tab.
- Done when: it feels like a “real editor”, not a textarea.

---

## Phase 4 — Preview mode (no split)

12. **Preview toggle (same pane)**

- Toggle between:
  - Edit (CodeMirror)
  - Preview (rendered HTML)
- Markdown rendering:
  - Markdown parser + sanitizer
  - Tailwind Typography `prose` for styling
- Done when: Preview is safe and matches Markdown well.

(Upgrade later) **“Live preview” feel**

- Optional future: render formatting inline (more complex). Don’t do this until core is solid.

---

## Phase 5 — Backlinks + graph-like stuff (Obsidian core #3)

13. **Backlinks panel (not split view)**

- Right-side “Info” panel (drawer) showing:
  - backlinks to current note
  - outgoing links from current note
- Build backlinks by scanning vault index (initially on-demand; later incremental).
- Done when: backlinks update after save.

14. **Global search**

- Use pure-JS full-text indexing (FlexSearch recommended) in **main**.
- Search titles + content; click result opens note.
- Done when: instant search on a modest vault.

15. **Quick switcher / command palette**

- Ctrl/Cmd+P:
  - Open note…
  - Create note…
  - Rename note…
- Done when: keyboard navigation is fast.

---

## Phase 6 — Sync with filesystem (watching + conflicts)

16. **Watch vault changes**

- Main uses a watcher (e.g., chokidar) to detect add/change/delete.
- Notify renderer via events: `vault.onDidChange(...)`.
- Done when: changes made outside the app appear automatically.

17. **Conflict handling**

- If file changes on disk while dirty:
  - show non-blocking warning: Reload / Overwrite
- Done when: no silent data loss.

---

## Phase 7 — App shell polish + Electron learnings

18. **Menu + shortcuts**

- Main `Menu` accelerators:
  - New note, Save, Rename, Search, Quick switcher, Toggle preview
- Done when: shortcuts feel native on Windows.

19. **Recent notes + favorites**

- Store recents/pins in a small JSON under `userData` (not in vault).
- Done when: you can jump around quickly.

---

## Phase 8 — Packaging (last)

20. **Production hardening**

- CSP (careful with dev/HMR)
- ensure preload API only
- verify `npm run build:win` produces a working installed app
- Done when: installed build can pick vault, edit, save, search, link.

---

## The exact first milestone (do this in order)

1. Fix preload typing + expose `locale`
2. Vault pick + persist
3. List vault tree
4. Open/read/write one note
5. Add CodeMirror and replace textarea
6. Add Save shortcut + dirty indicator

If you want, tell me which CodeMirror React wrapper you prefer (or “whatever is standard”), and I’ll outline the minimal dependency set + component structure for CodeMirror in your current src layout.
