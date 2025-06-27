import { cn, getAvatarFallback } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

export const UserAvatar = ({
  image,
  name,
  className,
}: {
  image?: string | null;
  name?: string | null;
  className?: string;
}) => {
  return (
    <Avatar className={cn('rounded-lg', className)}>
      <AvatarImage
        src={image || undefined}
        alt={name || 'User Avatar'}
        className={className}
      />
      <AvatarFallback className="rounded-lg">
        {getAvatarFallback(name)}
      </AvatarFallback>
    </Avatar>
  );
};
