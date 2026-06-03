import appIcon from './assets/image.png'

function App() {
  return (
    <>
      <header className="titlebar h-10 w-full flex items-center px-4 border-b border-white/20 bg-white/40 backdrop-blur-md">
        <img src={appIcon} alt="App Icon" className="w-5 h-5 mr-2 opacity-80" />
        <span className="text-sm font-medium text-slate-600 tracking-wide">Mark It</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative">
        <div className=" z-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight drop-shadow-sm">
            Ready to write.
          </h1>
          <p className="text-slate-500 mt-2">The foundation is set.</p>
        </div>
      </main>
    </>
  )
}
export default App

console.log('RENDERER STARTED')
