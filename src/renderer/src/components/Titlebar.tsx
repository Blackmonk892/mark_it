import appIcon from '../assets/image.png'

export function Titlebar() {
  return (
    <header className="titlebar flex h-10 w-full items-center justify-between border-b border-white/20 bg-white/40 px-4 backdrop-blur-md z-50">
      {/* Left: Branding */}
      <div className="flex items-center gap-2">
        <img src={appIcon} alt="App Icon" className="h-5 w-5 opacity-80" />
        <span className="text-sm font-semibold tracking-wide text-slate-700">Mark it</span>
      </div>

      {/* Right: Custom Window Controls */}
      {/* 'no-drag' allows buttons to be clicked without dragging the window */}
      <div className="flex items-center gap-2.5 no-drag">
        <button
          onClick={() => window.context.minimizeWindow()}
          className="h-3 w-3 rounded-full bg-slate-300 hover:bg-yellow-400 hover:shadow-sm transition-all duration-200"
          title="Minimize"
        />
        <button
          onClick={() => window.context.maximizeWindow()}
          className="h-3 w-3 rounded-full bg-slate-300 hover:bg-green-400 hover:shadow-sm transition-all duration-200"
          title="Maximize"
        />
        <button
          onClick={() => window.context.closeWindow()}
          className="h-3 w-3 rounded-full bg-slate-300 hover:bg-red-400 hover:shadow-sm transition-all duration-200"
          title="Close"
        />
      </div>
    </header>
  )
}
