import { Icons } from './icons'
import { Button } from './ui/button'

const FullscreenBtn = ({
  isFullScreen,
  toggleFullScreen,
}: {
  isFullScreen: boolean
  toggleFullScreen: () => void
}) => {
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
