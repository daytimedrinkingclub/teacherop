import {
  ChevronDown,
  ChevronLeft,
  ChevronsLeft,
  CircleCheck,
  CircleHelp,
  Info,
  LayoutDashboard,
  Library,
  Loader2,
  LucideProps,
  Menu,
  RefreshCw,
  User,
  X,
} from 'lucide-react'

export const Icons = {
  chevronLeft: ChevronLeft,
  spinner: Loader2,
  close: X,
  user: User,

  dashboard: LayoutDashboard,
  chevronDown: ChevronDown,
  chevronsLeft: ChevronsLeft,
  menu: Menu,
  library: Library,
  info: Info,

  circleCheck: CircleCheck,
  circleHelp: CircleHelp,
  refresh: RefreshCw,
  logo: ({ ...props }: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412.72 412.72" {...props}>
      <path d="M404.72 82.944h-27.2v-9.28a8 8 0 0 0-5.76-8 225.345 225.345 0 0 0-57.68-7.36c-32 0-75.6 7.2-107.84 40-32-33.12-75.92-40-107.84-40a225.345 225.345 0 0 0-57.68 7.36 8 8 0 0 0-5.76 8v9.2H8a8 8 0 0 0-8 8v255.52a8 8 0 0 0 8 8 7.996 7.996 0 0 0 3.92-1.04c.8-.4 80.8-44.16 192.48-16h1.92a8.008 8.008 0 0 0 1.92 0c112-28.4 192 15.28 192.48 16a8 8 0 0 0 12-6.88V90.944a8 8 0 0 0-8-8zM16 333.664V98.944h19.12v200.64a8 8 0 0 0 9.2 8 350.096 350.096 0 0 1 50-4 207.516 207.516 0 0 1 68.32 10.32A294.1 294.1 0 0 0 16 333.664zm78.32-46a351.994 351.994 0 0 0-43.52 2.8V79.984a220.645 220.645 0 0 1 47.44-5.28c29.92 0 71.2 6.88 99.84 39.2l.24 199.28c-16.64-10.88-49.12-25.52-104-25.52zm120-173.76c28.64-32 69.92-39.2 99.84-39.2a221.61 221.61 0 0 1 47.44 5.28v210.48a351.895 351.895 0 0 0-43.28-2.88c-54.56 0-87.12 14.64-104 25.52v-199.2zm182.32 219.76a294.158 294.158 0 0 0-146.96-19.76 208.008 208.008 0 0 1 68.64-10.32 349.994 349.994 0 0 1 50.32 3.92 8 8 0 0 0 9.2-8V98.944h19.12l-.32 234.72z" />
      <g fontSize="130" textAnchor="middle">
        <text x="130" y="230">
          O
        </text>
        <text x="280" y="230">
          P
        </text>
      </g>
    </svg>
  ),
}
