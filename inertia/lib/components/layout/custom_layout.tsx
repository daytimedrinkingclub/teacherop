import { cn } from '@/lib/utils'
import * as React from 'react'

const LayoutContext = React.createContext<{
  offset: number
  fixed: boolean
} | null>(null)

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  fixed?: boolean
}

const Layout = ({ className, fixed = false, ...props }: LayoutProps) => {
  const divRef = React.useRef<HTMLDivElement>(null)
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const div = divRef.current

    if (!div) return
    const onScroll = () => setOffset(div.scrollTop)

    // clean up code
    div.removeEventListener('scroll', onScroll)
    div.addEventListener('scroll', onScroll, { passive: true })
    return () => div.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <LayoutContext.Provider value={{ offset, fixed }}>
      <div
        ref={divRef}
        data-layout="layout"
        className={cn('h-full', fixed && 'flex flex-col', className)}
        {...props}
      />
    </LayoutContext.Provider>
  )
}
Layout.displayName = 'Layout'

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  sticky?: boolean
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, sticky, ...props }, ref) => {
    // Check if Layout.Header is used within Layout
    const contextVal = React.useContext(LayoutContext)
    if (contextVal === null) {
      throw new Error(`Layout.Header must be used within ${Layout.displayName}.`)
    }

    return (
      <div
        ref={ref}
        data-layout="header"
        className={cn(
          className
        )}
        {...props}
      />
    )
  }
)
Header.displayName = 'Header'

const Body = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    // Check if Layout.Body is used within Layout
    const contextVal = React.useContext(LayoutContext)
    if (contextVal === null) {
      throw new Error(`Layout.Body must be used within ${Layout.displayName}.`)
    }

    return (
      <div
        ref={ref}
        data-layout="body"
        className={cn(
          'px-4 md:py-6 md:overflow-hidden md:px-8',
          contextVal && contextVal.fixed && 'flex-1',
          className
        )}
        {...props}
      >
        {children}
        <div className="h-80 md:h-0"></div>
      </div>
    )
  }
)
Body.displayName = 'Body'

Layout.Header = Header
Layout.Body = Body

export { Layout }
