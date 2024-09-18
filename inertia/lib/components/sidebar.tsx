import { Link, usePage } from '@inertiajs/react'

export default function Sidebar() {
    const pathname = usePage().url
    const menuItems = [
        { name: 'My Account', href: '/account' },
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '/courses' },
        { name: 'Dashboard', href: '/dashboard' },
    ]

    return (
        <div className="w-44 h-screen bg-white p-4 border-r flex flex-col justify-between items-center">
            <nav className="space-y-4 mt-16 flex flex-col">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`text-lg font-bold ${pathname === item.href
                            ? 'font-bold border-b-2  border-black'
                            : 'text-gray-600 hover:text-black'
                            }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    )
}