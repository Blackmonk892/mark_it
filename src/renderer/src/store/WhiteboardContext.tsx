import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export interface Whiteboard {
  id: number
  title: string
  data: string
  createdAt: number
  updatedAt: number
}

interface WhiteboardContextType {
  whiteboards: Whiteboard[]
  activeBoard: Whiteboard | null
  isLoading: boolean
  setActiveBoard: (board: Whiteboard | null) => void
  createEmptyBoard: () => Promise<void>
  updateBoardData: (title: string, data: string) => void
  deleteBoard: (id: number) => Promise<void>
}

export const WhiteboardContext = createContext<WhiteboardContextType | undefined>(undefined)

export function WhiteboardProvider({ children }: { children: React.ReactNode }) {
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([])
  const [activeBoard, setActiveBoardState] = useState<Whiteboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const activeBoardRef = useRef<Whiteboard | null>(null)
  const debounceTimer = useRef<number | null>(null)

  const loadBoards = async () => {
    try {
      setIsLoading(true)
      const allBoards = await window.context.getAllWhiteboards()
      setWhiteboards(allBoards)

      if (allBoards.length > 0 && !activeBoardRef.current) {
        setActiveBoardState(allBoards[0])
      }
    } catch (error) {
      console.error('Failed to load whiteboards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBoards()
  }, [])

  const setActiveBoard = (board: Whiteboard | null) => {
    if (debounceTimer.current && activeBoardRef.current) {
      clearTimeout(debounceTimer.current)
      window.context.updateWhiteboard(
        activeBoardRef.current.id,
        activeBoardRef.current.title,
        activeBoardRef.current.data
      )
    }
    activeBoardRef.current = board
    setActiveBoardState(board)
  }

  const createEmptyBoard = async () => {
    try {
      // API expects (title, data) arguments
      await window.context.createWhiteboard('Untitled Canvas', '{"elements":[],"appState":{}}')
      await loadBoards()
    } catch (error) {
      console.error('Failed to create board:', error)
    }
  }

  const updateBoardData = (title: string, data: string) => {
    if (!activeBoard) return

    const updatedBoard = {
      ...activeBoard,
      title,
      data,
      updatedAt: Math.floor(Date.now() / 1000)
    }

    setActiveBoardState(updatedBoard)
    activeBoardRef.current = updatedBoard
    setWhiteboards((prev) =>
      [...prev.map((b) => (b.id === activeBoard.id ? updatedBoard : b))].sort(
        (a, b) => b.updatedAt - a.updatedAt
      )
    )

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = window.setTimeout(async () => {
      try {
        await window.context.updateWhiteboard(
          updatedBoard.id,
          updatedBoard.title,
          updatedBoard.data
        )
      } catch (error) {
        console.error('Failed to update board:', error)
      }
    }, 1000) // 1 second debounce for heavy JSON
  }

  const deleteBoard = async (id: number) => {
    try {
      await window.context.deleteWhiteboard(id)
      if (activeBoard?.id === id) {
        setActiveBoardState(null)
      }
      await loadBoards()
    } catch (error) {
      console.error('Failed to delete board:', error)
    }
  }

  return (
    <WhiteboardContext.Provider
      value={{
        whiteboards,
        activeBoard,
        isLoading,
        setActiveBoard,
        createEmptyBoard,
        updateBoardData,
        deleteBoard
      }}
    >
      {children}
    </WhiteboardContext.Provider>
  )
}

export const useWhiteboards = () => {
  const context = useContext(WhiteboardContext)
  if (!context) throw new Error('useWhiteboards must be used within a WhiteboardProvider')
  return context
}
