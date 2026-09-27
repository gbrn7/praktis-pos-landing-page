'use client';

import * as React from 'react';
import { PanelLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean }
>(({ className, defaultOpen = true, children, ...props }, ref) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar, isMobile }}>
      <div
        ref={ref}
        className={cn('flex min-h-screen w-full bg-[#FDFDFD] dark:bg-[#0B0B0C]', className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = 'SidebarProvider';

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, isMobile } = useSidebar();

    if (isMobile) {
      if (!open) return null;
      return (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs">
          <div
            ref={ref}
            className={cn(
              'relative flex h-full w-72 flex-col border-r border-[#E7E7EE] dark:border-[#232326] bg-[#FFFFFF] dark:bg-[#111113] p-4 text-[#000000] dark:text-[#FFFFFF] shadow-2xl transition-all',
              className
            )}
            {...props}
          >
            <div className="absolute right-3 top-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8 text-[#525252] dark:text-[#A1A1AA]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {children}
          </div>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      );
    }

    return (
      <aside
        ref={ref}
        className={cn(
          'sticky top-0 z-30 flex h-screen flex-col border-r border-[#E7E7EE] dark:border-[#232326] bg-[#FFFFFF] dark:bg-[#111113] p-4 text-[#000000] dark:text-[#FFFFFF] transition-all duration-200',
          open ? 'w-64' : 'w-20',
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = 'Sidebar';

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn('h-9 w-9 text-[#525252] dark:text-[#A1A1AA]', className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2 pb-4 border-b border-[#E7E7EE] dark:border-[#232326]', className)} {...props} />
  )
);
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-y-auto py-4 space-y-1', className)} {...props} />
  )
);
SidebarContent.displayName = 'SidebarContent';

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-4 border-t border-[#E7E7EE] dark:border-[#232326]', className)} {...props} />
  )
);
SidebarFooter.displayName = 'SidebarFooter';

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('space-y-1', className)} {...props} />
  )
);
SidebarMenu.displayName = 'SidebarMenu';

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
  )
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, ...props }, ref) => {
    const { open } = useSidebar();
    return (
      <button
        ref={ref}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer',
          isActive
            ? 'bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] font-semibold'
            : 'text-[#525252] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E22] hover:text-[#000000] dark:hover:text-[#FFFFFF]',
          !open && 'justify-center px-2',
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';
