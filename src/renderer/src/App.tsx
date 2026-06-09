import { AppShell } from './components'
import { Editor } from './components/Editor'
import { MediaPlayer } from './components/media/MediaPlayer'
import { WhiteboardCanvas } from './components/whiteboard/WhiteboardCanvas'
import { useNotes } from './hooks/useNotes'

function App() {
  const { activeNote, activeModule } = useNotes()

  return (
    <AppShell>
      {activeModule === 'media' ? (
        <MediaPlayer />
      ) : activeModule === 'whiteboard' ? (
        <WhiteboardCanvas />
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
