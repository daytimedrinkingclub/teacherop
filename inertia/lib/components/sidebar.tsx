import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { sideLinks } from '../lib/data/side_links'
import { Icons } from './icons'
import { Layout } from './layout/custom_layout'
import Nav from './nav'
import { Button } from './ui/button'
import { UserNav } from './user_nav'
import MobileBottomNavBar from './mobileBottomNavBar'

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({ className, isCollapsed, setIsCollapsed }: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  return (
    <aside
      className={cn(
        `bg-gray-50 fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
        className
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 bg-white shadow-md ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? 'h-svh' : ''}>
        {/* Header */}
        <Layout.Header
          sticky
          className="z-50 flex justify-between px-4 py-3 overflow-hidden shadow-sm md:px-4"
        >
          <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <Icons.logo className="w-8 h-8 stroke-blue-600" />
            <div
              className={`flex flex-col justify-end ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <span className="font-medium text-lg md:text-2xl text-blue-600">TeacherOP</span>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <Icons.close /> : <Icons.menu />}
          </Button> */}
          <div className=' md:hidden'>
            <UserNav />
          </div>
        </Layout.Header>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1 overflow-auto ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sideLinks}
        />
        <MobileBottomNavBar
          links={sideLinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute z-50 hidden rounded-full -right-5 top-1/2 md:inline-flex"
        >
          <Icons.chevronsLeft className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </Layout>
    </aside>
  )
}
