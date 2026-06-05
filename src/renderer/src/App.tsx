import { AppShell } from './components'
import { Editor } from './components/Editor'
import { useNotes } from './hooks/useNotes'

function App() {
  const { activeNote } = useNotes()

  return (
    <AppShell>
      {activeNote ? (
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
