import appIcon from './assets/image.png'

export function Titlebar() {
  return (
    <header className="titlebar flex h-10 w-full items-center justify-between border-b border-white/20 bg-white/40 px-4 backdrop-blur-md z-50">
      <div className="flex items-center gap-2">
        <img src={appIcon} alt="App Icon" className="h-5 w-5 opacity-80" />
        <span className="text-sm font-semibold tracking-wide text-slate-700">Mark it</span>
      </div>
    </header>
  )
}
