import { Button } from './ui/button'
import { Icons } from './icons'
import { useFullScreen } from '../hooks/use_fullscreen'

const FullscreenBtn = () => {
  const { isFullScreen, toggleFullScreen } = useFullScreen()

  return (
    <Button variant="ghost" size="icon" onClick={() => toggleFullScreen()} className="p-2">
      {isFullScreen ? (
        <Icons.minimize className="w-4 h-4" />
      ) : (
        <Icons.maximize className="w-4 h-4" />
      )}
    </Button>
  )
}

export default FullscreenBtn
