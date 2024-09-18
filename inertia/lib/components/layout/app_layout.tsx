import { Layout } from './custom_layout'
import Sidebar from '../sidebar'
import { UserNav } from '../user_nav'

interface AppLayoutProps {
  children?: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {

  return (
    <div className="relative h-full overflow-hidden bg-background flex justify-between">
      <div className="fixed inset-0 z-50 h-10 w-full">
        <div className="supports-backdrop-blur:bg-background/60 flex items-center justify-between border-b p-4 backdrop-blur">
          <div></div>
          <UserNav />
        </div>
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-60 flex-col overflow-auto md:flex" >
        <Sidebar />
      </div>
      <main className="h-full w-full border-t  pt-[70px] md:pl-60">
        {/*  bg-gradient-to-l  from-pink-300/5 via-blue-300/5 to-background */}
        <Layout fixed>{children}</Layout>
        <div className="h-[400px]">

        </div>
      </main>
    </div>
    // <div className="relative h-full overflow-hidden bg-background flex justify-between">
    //   <Sidebar />
    //   <main
    //     id="content"
    //     className={`overflow-x-hidden pt-16 transition-[margin] md:pt-0 md:overflow-y-hidden h-full`}
    //   >
    //     <TooltipProvider>
    //       <Toaster />
    //       <Layout fixed>{children}</Layout>
    //     </TooltipProvider>
    //   </main>
    // </div>
  )
}

export default AppLayout
