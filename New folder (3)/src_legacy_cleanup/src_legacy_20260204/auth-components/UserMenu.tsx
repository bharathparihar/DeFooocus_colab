import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/ui/avatar';
import { User } from '@supabase/supabase-js';

interface UserMenuProps {
  user: User;
  onSignOut: () => void;
}

export const UserMenu = ({ user, onSignOut }: UserMenuProps) => {
  const emailInitial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="user-menu-trigger">
          <Avatar className="user-menu-avatar">
            <AvatarFallback className="user-menu-avatar-fallback">
              {emailInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="user-menu-content">
        <DropdownMenuLabel className="user-menu-label">
          <div className="user-menu-label-content">
            <UserIcon className="user-menu-label-icon" />
            <span className="user-menu-email">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="user-menu-item-logout">
          <LogOut className="user-menu-item-icon" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
