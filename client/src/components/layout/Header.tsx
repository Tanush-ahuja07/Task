import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, CheckSquare, LogOut, User, Sparkles } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-[var(--shadow-card)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/notes" className="flex items-center space-x-2 hover:opacity-80 transition-[var(--transition-smooth)]">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-card-foreground">ProductiveAI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive('/notes') ? 'default' : 'ghost'}
              asChild
              className={isActive('/notes') ? 'bg-primary text-primary-foreground' : 'text-card-foreground hover:bg-card-hover'}
            >
              <Link to="/notes" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Notes</span>
              </Link>
            </Button>

            <Button
              variant={isActive('/todos') ? 'default' : 'ghost'}
              asChild
              className={isActive('/todos') ? 'bg-primary text-primary-foreground' : 'text-card-foreground hover:bg-card-hover'}
            >
              <Link to="/todos" className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4" />
                <span>Todos</span>
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-card-hover">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-card-foreground">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="md:hidden" asChild>
                <Link to="/notes" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Notes</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="md:hidden" asChild>
                <Link to="/todos" className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Todos</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};