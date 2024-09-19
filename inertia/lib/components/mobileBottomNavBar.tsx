import { Link } from '@inertiajs/react'
import { cn } from '../lib/utils'

export interface NavLink {
  title: string
  href: string
  icon: JSX.Element
}

export interface MobileBottomNavBarProps {
  links: NavLink[]
}

const MobileBottomNavBar = ({ links }: MobileBottomNavBarProps) => {
  const isActive = (href: string) => {
    return window.location.pathname === href
  }
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-between border-t bg-white p-4 shadow-lg md:hidden">
      {links.map((item) => (
        <Link key={item.href} href={item.href}>
          <div
            className={cn(
              'flex flex-col items-center',
              isActive(item.href)
                ? 'font-bold text-blue-500'
                : 'text-lg font-medium text-muted-foreground'
            )}
          >
            <div className="mb-1 text-lg">{item.icon} </div>
            <div className="text-xs">{item.title}</div>
          </div>
        </Link>
      ))}
    </nav>
  )
}

export default MobileBottomNavBar
