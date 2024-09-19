import { Link, usePage } from '@inertiajs/react'
import { Icons } from './icons'
import MobileBottomNavBar from './mobileBottomNavBar'

export default function Sidebar() {
    const pathname = usePage().url
    const menuItems = [
        // { title: 'My Account', href: '/courses', icon: <Icons.user /> },
        { title: 'Home', href: '/', icon: <Icons.home /> },
        { title: 'Courses', href: '/courses', icon: <Icons.book /> },
        { title: 'Dashboard', href: '/dashboard', icon: <Icons.dashboard /> },
    ]

    return (
        <>
            <MobileBottomNavBar links={menuItems} />
            <div className="w-44 h-screen bg-white p-4 border-r flex flex-col items-center">
                <h1 className="flex items-center">
                    <Icons.logo className="w-32 h-32" />
                </h1>
                <nav className="space-y-4 flex flex-col">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`text-lg font-bold ${pathname === item.href
                                ? 'font-bold border-b-2  border-black'
                                : 'text-gray-600 hover:text-black'
                                }`}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    )
}
