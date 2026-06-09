import { FiEdit3, FiFileText, FiPlayCircle } from 'react-icons/fi'
import { useNotes } from '../hooks/useNotes'
import { cn } from '../utils'

export function ActivityBar() {
  const { activeModule, setActiveModule } = useNotes()

  return (
    <aside className="flex h-full w-16 shrink-0 flex-col items-center gap-3 border-r border-white/30 bg-white/20 px-2 py-4 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setActiveModule('notes')}
        className={cn(
          'group flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-200',
          activeModule === 'notes'
            ? 'border-white/70 bg-white/80 text-slate-900 shadow-lg shadow-white/30 scale-105'
            : 'border-white/20 bg-white/10 text-slate-500 hover:border-white/40 hover:bg-white/30 hover:text-slate-800'
        )}
        aria-label="Switch to Notes"
        title="Notes"
      >
        <FiFileText className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
      </button>

      <button
        type="button"
        onClick={() => setActiveModule('media')}
        className={cn(
          'group flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-200',
          activeModule === 'media'
            ? 'border-white/70 bg-white/80 text-slate-900 shadow-lg shadow-white/30 scale-105'
            : 'border-white/20 bg-white/10 text-slate-500 hover:border-white/40 hover:bg-white/30 hover:text-slate-800'
        )}
        aria-label="Switch to Media"
        title="Media"
      >
        <FiPlayCircle className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
      </button>

      <button
        type="button"
        onClick={() => setActiveModule('whiteboard')}
        className={cn(
          'group flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-200',
          activeModule === 'whiteboard'
            ? 'border-white/70 bg-white/80 text-slate-900 shadow-lg shadow-white/30 scale-105'
            : 'border-white/20 bg-white/10 text-slate-500 hover:border-white/40 hover:bg-white/30 hover:text-slate-800'
        )}
        aria-label="Switch to Whiteboard"
        title="Whiteboard"
      >
        <FiEdit3 className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
      </button>
    </aside>
  )
}
