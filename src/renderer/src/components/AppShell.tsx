import { ReactNode } from 'react'
import { ActivityBar } from './ActivityBar'
import { Sidebar } from './Sidebar'
import { Titlebar } from './Titlebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col bg-transparent overflow-hidden">
      <Titlebar />

      <div className="flex h-full flex-row overflow-hidden">
        <ActivityBar />

        <Sidebar />

        {/* Main Editor Area */}
        <main className="relative min-w-0 flex-1 bg-white/10 backdrop-blur-md">{children}</main>
      </div>
    </div>
  )
}
