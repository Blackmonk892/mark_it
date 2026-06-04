import { AppShell } from './components'
import { useNotes } from './hooks/useNotes'

function App() {
  const { activeNote } = useNotes()

  return (
    <AppShell>
      {activeNote ? (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          {/* This is where CodeMirror goes! 
            For now, we display a beautiful placeholder.
          */}
          <div className="h-full w-full max-w-4xl rounded-xl border border-white/20 bg-white/40 shadow-sm backdrop-blur-xl flex items-center justify-center">
            <div className="text-slate-400 flex flex-col items-center gap-2">
              <span className="text-lg font-medium text-slate-600">Editor Space</span>
              <span className="text-sm">
                Ready to wire up CodeMirror for:{' '}
                <strong className="text-slate-700">{activeNote.title}</strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-slate-400">
          <span>Create or select a note to start writing.</span>
        </div>
      )}
    </AppShell>
  )
}

export default App
