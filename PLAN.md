## Plan: NoteMark-Style Markdown Editor (Windows)

Build a Windows-first Electron app (main + preload + renderer) that edits Markdown with a split editor/preview layout and a shadcn/ui-style design system. For v1, use a “vault folder” of `.md` files plus a small JSON metadata index (no native DB builds on Windows), then upgrade the editor from a basic textarea MVP to CodeMirror 6 once the full open/edit/save loop is solid.

How we’ll do it (teaching style): each step is a tight loop — concept → implement → run → quick review.

**Steps**

1. **Baseline + guardrails (foundation for everything else)**
   - Fix the current `window.context` mismatch (it’s typed as `{}` but used as `window.context.locale`) and decide on a stable renderer API surface.
   - Adjust global CSS so an editor is usable (remove `select-none`/`overflow-hidden`-style constraints where needed; set an explicit app background/foreground instead of transparent-only).
   - Create the basic app shell layout (header + sidebar + main area) with Electron drag regions handled correctly.
   - Learn: Electron’s 3-process architecture (main/preload/renderer) and what belongs where.

2. **Shadcn-like UI setup (consistent “awesome” look)**
   - Configure Tailwind for shadcn-style theming (CSS variables, `darkMode: ['class']`, and shadcn’s recommended plugin set).
   - Add shadcn/ui component scaffolding in the renderer (via the shadcn CLI) and standardize the `cn` utility (either reuse the existing one or place it where shadcn expects).
   - Establish a Markdown preview style using Tailwind Typography (`prose` + `prose-invert`) so preview looks polished immediately.
   - Learn: shadcn-style theming (CSS variables) and composable UI via Radix primitives.

3. **Storage decision implemented as a “vault” + JSON index (no native DB builds)**
   - Implement a vault folder selector and persist the chosen path in app settings.
   - Notes are real `.md` files; metadata lives in a JSON index under Electron’s `userData` (title, createdAt, updatedAt, pinned, etc.).
   - Define the core operations needed by the UI: list notes, read note, write note, create note, rename note, delete note.
   - Learn: file-based persistence patterns (vault + metadata index) without native DB tooling.

4. **Secure IPC boundary (Electron fundamentals, correctly)**
   - Main process owns file system access (`fs/promises`, `dialog`) and exposes only specific operations via `ipcMain.handle`.
   - Preload exposes a typed, minimal API via `contextBridge.exposeInMainWorld` (no broad Node access in the renderer).
   - Add path validation so renderer requests can’t escape the vault folder.
   - Learn: secure IPC (`ipcMain.handle`/`invoke`), typed `contextBridge` APIs, and path validation.

5. **MVP UX (split editor/preview, shadcn components)**
   - Sidebar: list notes (title + updated date), quick create/delete, and a simple filter/search.
   - Main: textarea editor (fast MVP) + Markdown preview panel.
   - Wire up save flows (Save / Save As) and a “dirty” indicator; add keyboard shortcuts (Ctrl+S, Ctrl+N) using an app menu + accelerators.
   - Learn: save flows + “dirty” state, and keyboard shortcuts via Electron menus.

6. **Upgrade to a “real” editor (CodeMirror 6)**
   - Swap textarea for CodeMirror 6 with Markdown language support, undo/redo, search, and sensible keybindings.
   - Keep the same storage + IPC layer so the upgrade is UI-only.
   - Learn: integrating CodeMirror 6 cleanly (UI vs persistence separation).

7. **Packaging + Windows release readiness**
   - Ensure `electron-builder` outputs an NSIS installer cleanly and that the app works when installed.
   - Tighten any security knobs that differ between dev/prod (CSP, devtools behavior), without breaking HMR.
   - Learn: `electron-builder`/NSIS packaging, and dev vs prod knobs.

**Relevant files**

- [package.json](package.json) — dependencies/scripts for editor, markdown, shadcn/ui, and storage.
- [src/main/index.ts](src/main/index.ts) — BrowserWindow + menu + IPC registration (likely factor IPC into `src/main/lib/*`).
- [src/preload/index.ts](src/preload/index.ts) and [src/preload/index.d.ts](src/preload/index.d.ts) — typed bridge API exposed to the renderer.
- [src/renderer/src/App.tsx](src/renderer/src/App.tsx) — app shell UI and main layout.
- [src/renderer/src/assets/index.css](src/renderer/src/assets/index.css) — global theme tokens + typography + scrollbars.
- [tailwind.config.js](tailwind.config.js) — Tailwind + shadcn-style theming config.
- [electron-builder.yml](electron-builder.yml) — Windows packaging.

**Verification**

1. Run `npm run dev` and confirm: choose vault → create note → edit → preview renders → save persists.
2. Run `npm run typecheck` and `npm run lint`.
3. Run `npm run build:win`, install the output, and repeat the vault/create/edit/save flow.

**Decisions**

- Storage (v1): vault folder of Markdown files + JSON index (recommended to avoid native build tooling). MongoDB is deliberately out of scope for v1.
- Editor: textarea MVP → CodeMirror 6 upgrade once the end-to-end loop is working.
- Layout: split view editor + preview for best UX.

**Further Considerations**

1. If you want “database-like” querying/search without native modules, we can add a pure-JS indexer (e.g., Lunr/FlexSearch) in a later step; SQLite can be revisited once build tooling is acceptable.
