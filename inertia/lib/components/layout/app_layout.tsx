import { Toaster } from '@/components/ui/sonner'

import useIsCollapsed from '~/lib/hooks/use_is_collapsed'
import Sidebar from '../sidebar'
import { TooltipProvider } from '../ui/tooltip'
import { Layout } from './custom_layout'

interface AppLayoutProps {
  children?: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  return (
    <div className="relative h-full overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`overflow-x-hidden  pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <TooltipProvider>
          <Toaster />
          <Layout fixed>{children}</Layout>
        </TooltipProvider>
      </main>
    </div>
  )
}

export default AppLayout
