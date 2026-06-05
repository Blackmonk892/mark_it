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

  const editor = useCreateBlockNote({
    initialContent: parseBlocks(activeNote?.content ?? '')
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
      <div className="h-full rounded-xl border border-white/40 bg-white/70 shadow-sm backdrop-blur-md overflow-hidden">
        <BlockNoteView
          editor={editor}
          onChange={() => {
            if (isLoadingNoteRef.current) return

            const blocks = editor.document
            const title = extractTitle(blocks)

            updateNoteContent(title, JSON.stringify(blocks))
          }}
        />
      </div>
    </div>
  )
}
