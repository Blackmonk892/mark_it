import { Excalidraw } from '@excalidraw/excalidraw'
import { useEffect, useState } from 'react'
import { useWhiteboards } from '../../store/WhiteboardContext'

export function WhiteboardCanvas() {
  const { activeBoard, updateBoardData } = useWhiteboards()
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)

  // Force component re-mount when switching boards so Excalidraw loads the new initialData
  const [boardKey, setBoardKey] = useState(activeBoard?.id)

  useEffect(() => {
    if (activeBoard && activeBoard.id !== boardKey) {
      setBoardKey(activeBoard.id)
    }
  }, [activeBoard?.id])

  if (!activeBoard) {
    return (
      <div className="flex h-full items-center justify-center bg-transparent text-slate-600">
        <div className="rounded-3xl border border-white/40 bg-white/60 px-8 py-10 text-center shadow-xl backdrop-blur-xl">
          <p className="text-2xl font-semibold text-slate-800">Whiteboard</p>
          <p className="mt-3 text-sm text-slate-500">
            Select or create a canvas to start sketching.
          </p>
        </div>
      </div>
    )
  }

  // Safely parse the stored JSON data
  let initialData = { elements: [], appState: {} }
  try {
    if (activeBoard.data) {
      initialData = JSON.parse(activeBoard.data)
    }
  } catch (e) {
    console.error('Failed to parse board data', e)
  }

  const handleChange = (elements: readonly any[], appState: any) => {
    // Only save if it's an actual change by the user
    if (appState.draggingElement || appState.resizingElement || appState.editingElement) return

    // Extract title from appState if Excalidraw natively supports it, otherwise default
    const title = activeBoard.title !== 'Untitled Canvas' ? activeBoard.title : 'Canvas Drawing'

    const stringifiedData = JSON.stringify({
      elements,
      appState: { ...appState, collaborators: [] }
    })
    updateBoardData(title, stringifiedData)
  }

  return (
    <div className="h-full w-full p-4 flex flex-col">
      {/* Top Bar for Board Title */}
      <div className="mb-4 ml-2 flex items-center">
        <input
          type="text"
          value={activeBoard.title}
          onChange={(e) => updateBoardData(e.target.value, activeBoard.data)}
          className="bg-transparent text-xl font-bold text-slate-800 outline-none hover:bg-white/30 focus:bg-white/50 px-2 py-1 rounded-md transition-colors"
        />
      </div>

      {/* Excalidraw Wrapper */}
      <div className="flex-1 rounded-2xl border border-white/50 bg-white shadow-sm overflow-hidden z-0">
        <Excalidraw
          key={boardKey}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={initialData}
          onChange={handleChange}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: true,
              clearCanvas: true,
              saveAsImage: true,
              loadScene: false, // We manage our own saving/loading
              export: false,
              toggleTheme: false // Keeping it light to match your frosted glass
            }
          }}
        />
      </div>
    </div>
  )
}
