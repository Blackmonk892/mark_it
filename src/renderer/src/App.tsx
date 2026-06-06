import { AppShell } from './components'
import { Editor } from './components/Editor'
import { useNotes } from './hooks/useNotes'

function App() {
  const { activeNote, activeModule } = useNotes()

  return (
    <AppShell>
      {activeModule === 'media' ? (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/20 via-white/10 to-transparent text-slate-600">
          <div className="rounded-3xl border border-white/30 bg-white/25 px-8 py-10 text-center shadow-2xl shadow-slate-900/5 backdrop-blur-md">
            <p className="text-2xl font-semibold text-slate-800">Media Player Canvas</p>
            <p className="mt-3 text-sm text-slate-500">
              Playback, previews, and timelines will render here.
            </p>
          </div>
        </div>
      ) : activeNote ? (
        <Editor />
      ) : (
        <div className="flex h-full items-center justify-center text-slate-400">
          <span>Create or select a note to start writing.</span>
        </div>
      )}
    </AppShell>
  )
}

export default App
