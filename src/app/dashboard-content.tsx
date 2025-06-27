import { redirect } from 'next/navigation';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import AppSidebar from '@/components/sidebar/app-sidebar';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ModeToggle } from '@/components/sidebar/mode-toggle';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { auth } from '@/auth';

type Props = {
  readonly children: React.ReactNode;
};
export async function DashboardContent({ children }: Props) {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/auth/login');
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="jtech-lms-theme"
    >
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar session={session} />
          <SidebarInset>
            <header className="flex shadow-sm sticky top-0 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <div className="ms-auto flex items-center gap-2">
                  <ModeToggle />
                  <Button variant="ghost" size="icon">
                    <UserAvatar
                      image={session.user.image}
                      name={session.user.name}
                    />
                  </Button>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 pt-0 ">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}
