import { AvatarProps } from '@radix-ui/react-avatar'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface UserAvatarProps extends AvatarProps {
  user: {
    email: string
    name?: string
  }
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {/*{user.image ? (*/}
      {/*  // <AvatarImage alt="Picture" src={user.image} />*/}
      {/*  <></>*/}
      {/*) : (*/}
      <AvatarFallback>
        <span className="sr-only">{user.name}</span>
        <Icons.user className="w-4 h-4" />
      </AvatarFallback>
      {/*)}*/}
    </Avatar>
  )
}
