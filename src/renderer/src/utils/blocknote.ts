export function parseBlocks(content: string) {
  try {
    return content ? JSON.parse(content) : undefined
  } catch {
    return [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: content
          }
        ]
      }
    ]
  }
}

export function extractTitle(document: any[]): string {
  if (!document?.length) {
    return 'Untitled Note'
  }

  const firstBlock = document[0]

  if (!firstBlock?.content) {
    return 'Untitled Note'
  }

  const title = firstBlock.content
    .map((item: any) => item.text ?? '')
    .join('')
    .trim()

  return title || 'Untitled Note'
}

export function extractPreview(document: any[]): string {
  if (!document?.length) {
    return 'No Content...'
  }

  for (const block of document.slice(1)) {
    if (!block?.content) continue

    const text = block.content
      .map((item: any) => item.text ?? '')
      .join('')
      .trim()

    if (text.length > 0) {
      return text
    }
  }

  return 'No content...'
}
