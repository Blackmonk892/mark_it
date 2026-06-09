import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useWhiteboards } from '../../store/WhiteboardContext'
import { cn, formatDateFromMs } from '../../utils'

export function WhiteboardSidebar() {
  const { whiteboards, activeBoard, setActiveBoard, createEmptyBoard, deleteBoard } =
    useWhiteboards()

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-white/40 bg-white/60 backdrop-blur-xl">
      <div className="flex items-center justify-between p-4 border-b border-white/30">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Canvases</h2>

        <button
          onClick={createEmptyBoard}
          className="group flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white/70 transition-all hover:bg-slate-800 hover:text-white shadow-sm"
          title="New Canvas"
        >
          <FiPlus className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {whiteboards.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-400">No canvases yet. Create one!</div>
        ) : (
          whiteboards.map((board) => (
            <div
              key={board.id}
              onClick={() => setActiveBoard(board)}
              className={cn(
                'group relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition-all',
                activeBoard?.id === board.id
                  ? 'bg-white/90 shadow-sm border border-slate-200/60'
                  : 'hover:bg-white/50 border border-transparent'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors',
                  activeBoard?.id === board.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-white/60 text-slate-400 shadow-sm'
                )}
              >
                <FiEdit3 className="h-4 w-4" />
              </div>

              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-semibold text-slate-800">{board.title}</span>
                <span className="truncate text-[10px] font-medium text-slate-400">
                  {formatDateFromMs(board.updatedAt * 1000)}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteBoard(board.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 absolute right-3"
                title="Delete Canvas"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
