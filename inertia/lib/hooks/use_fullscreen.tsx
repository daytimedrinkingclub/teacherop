import { useState, useEffect } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen()
    } catch (error) {
      console.error("Couldn't enter fullscreen mode:", error)
    }
  }

  return { isFullscreen, enterFullscreen }
}
