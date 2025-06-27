import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Command } from 'lucide-react';
import { NavUser } from '@/components/sidebar/nav-user';
import { SidebarGroup } from '@/components/sidebar/sidebar-group';
import { type Session } from 'next-auth';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  /** The session object containing user information */
  session: Session;
};

const data = {
  mainNav: [
    {
      title: 'Tableau de bord',
      icon: 'LayoutDashboard',
      url: '',
    },
  ],
};
export default async function AppSidebar({
  session,
  ...props
}: AppSidebarProps) {
  if (!session?.user) return null;

  const roleItems: Record<
    string,
    Array<{
      title: string;
      icon: string;
      url: string;
      subItems?: Array<{ title: string; url: string }>;
    }>
  > = {
    TEACHER: [
      { title: 'Mes cours', icon: 'Book', url: '/dashboard/teacher/courses' },
      { title: 'Étudiants', icon: 'Users', url: '/dashboard/teacher/students' },
    ],
    STUDENT: [
      {
        title: 'Cours suivis',
        icon: 'BookOpen',
        url: '/dashboard/student/courses',
      },
      {
        title: 'Progression',
        icon: 'BarChart',
        url: '/dashboard/student/progress',
      },
    ],
    ADMIN: [
      { title: 'Utilisateurs', icon: 'UserCog', url: '/dashboard/admin/users' },
      {
        title: 'Statistiques',
        icon: 'PieChart',
        url: '/dashboard/admin/stats',
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={'/dashboard'}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">JTECH LMS</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup label={'Menu Principal'} items={data.mainNav} />

        {roleItems[session.user.role as keyof typeof roleItems] && (
          <SidebarGroup
            label={
              session.user.role === 'TEACHER'
                ? 'Enseignant'
                : session.user.role === 'STUDENT'
                ? 'Étudiant'
                : 'Admin'
            }
            items={roleItems[session.user.role as keyof typeof roleItems]}
          />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            role: session.user.role as string,
            email: session.user.email as string,
            avatar: session.user.image as string,
            name: session.user.name as string,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
