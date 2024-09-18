import { ChevronRight } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from '@inertiajs/react'

interface NavLink {
  name: string
  href: string
}

interface BreadcrumbNavProps {
  links: NavLink[]
}

export default function BreadcrumbNav({ links }: BreadcrumbNavProps) {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {links.map((link, index) => (
          <BreadcrumbItem key={link.href}>
            {index < links.length - 1 ? (
              <>
                <BreadcrumbLink asChild>
                  <Link href={link.href}>{link.name}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              </>
            ) : (
              <BreadcrumbPage>{link.name}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
