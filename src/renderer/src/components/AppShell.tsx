import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Titlebar } from './Titlebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col bg-transparent overflow-hidden">
      <Titlebar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main Editor Area */}
        <main className="flex-1 relative bg-white/10 backdrop-blur-md">{children}</main>
      </div>
    </div>
  )
}
