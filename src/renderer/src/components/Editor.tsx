import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import { useEffect, useRef } from 'react'

import { useNotes } from '../hooks/useNotes'
import { extractTitle, parseBlocks } from '../utils/blocknote'

export function Editor() {
  const { activeNote, updateNoteContent } = useNotes()
  const isLoadingNoteRef = useRef(false)

  const handleLocalUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          // Create an invisible canvas
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1200 // Max sensible width for notes
          let width = img.width
          let height = img.height

          // Maintain aspect ratio while scaling down
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) return resolve(event.target?.result as string) // Fallback if canvas fails

          // Draw and compress to WebP at 80% quality
          ctx.drawImage(img, 0, 0, width, height)
          const compressedBase64 = canvas.toDataURL('image/webp', 0.8)

          resolve(compressedBase64)
        }
        img.onerror = reject
        img.src = event.target?.result as string
      }

      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const editor = useCreateBlockNote({
    initialContent: parseBlocks(activeNote?.content ?? ''),
    uploadFile: handleLocalUpload
  })

  useEffect(() => {
    if (!activeNote) return

    const blocks = parseBlocks(activeNote.content)

    if (blocks) {
      isLoadingNoteRef.current = true
      editor.replaceBlocks(editor.document, blocks)
      queueMicrotask(() => {
        isLoadingNoteRef.current = false
      })
    }
  }, [activeNote?.id])

  return (
    <div className="h-full w-full p-6">
      {/* 2. The Invisible Scrollbar Fix: 
        We use overflow-y-auto but inject raw CSS to hide the ugly standard bar,
        giving you smooth trackpad/mouse scrolling with zero visual clutter.
      */}
      <div className="h-full rounded-xl border border-white/40 bg-white/70 shadow-sm backdrop-blur-md overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Added py-8 so your text doesn't stick to the very top/bottom edges */}
        <div className="py-8 px-4">
          <BlockNoteView
            editor={editor}
            theme="light" // Hardcoded light to match the Milky White aesthetic
            onChange={() => {
              if (isLoadingNoteRef.current) return

              const blocks = editor.document
              const title = extractTitle(blocks)

              updateNoteContent(title, JSON.stringify(blocks))
            }}
          />
        </div>
      </div>
    </div>
  )
}
