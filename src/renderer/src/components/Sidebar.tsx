import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { useNotes } from '../hooks/useNotes'
import { cn, formatDateFromMs } from '../utils'
import { extractPreview, parseBlocks } from '../utils/blocknote'

export function Sidebar() {
  const { notes, activeNote, setActiveNote, createEmptyNote, deleteExistingNote } = useNotes()

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-white/30 bg-white/30 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Notes</h2>

        <button
          onClick={createEmptyNote}
          className="group flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white/50 transition-all hover:bg-slate-800 hover:text-white shadow-sm"
          title="New Note"
        >
          <FiPlus className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-400">No notes yet. Create one!</div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={cn(
                'group relative flex cursor-pointer flex-col gap-1 rounded-lg px-3 py-3 transition-all',
                activeNote?.id === note.id
                  ? 'bg-white/80 shadow-sm border border-slate-200/50' // Active state
                  : 'hover:bg-white/50 border border-transparent' // Inactive hover state
              )}
            >
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-semibold text-slate-800">
                  {note.title || 'Untitled Note'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation() // Prevent selecting the note when deleting
                    deleteExistingNote(note.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50"
                  title="Delete Note"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="truncate text-xs text-slate-400">
                  {extractPreview(parseBlocks(note.content) ?? [])}
                </span>
                <span className="whitespace-nowrap text-[10px] font-medium text-slate-400">
                  {formatDateFromMs(note.updatedAt * 1000)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
