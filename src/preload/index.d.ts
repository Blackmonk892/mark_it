declare global {
  interface Window {
    context: {
      locale: string
      platform: 'win32' | 'darwin' | 'linux'
    }
  }
}
