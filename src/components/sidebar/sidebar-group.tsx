'use client';

import {
  BarChart,
  Book,
  BookOpen,
  ChevronRight,
  LayoutDashboard,
  PieChart,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react';
import {
  SidebarGroup as ShadcnSidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Suspense, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export type SidebarGroupProps = {
  label: string;
  items: Array<{
    title: string;
    url: string;
    icon?: string;
    subItems?: Array<{ title: string; url: string }>;
  }>;
};

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard: LayoutDashboard,
  Book: Book,
  Users: Users,
  BookOpen: BookOpen,
  BarChart: BarChart,
  UserCog: UserCog,
  PieChart: PieChart,
};

export const SidebarGroup = ({ label, items }: SidebarGroupProps) => {
  const pathname = usePathname();
  const isActive = useMemo(
    () => (path: string) => path.startsWith(pathname) || path === pathname,
    [pathname]
  );

  return (
    <Suspense fallback={<ShadcnSidebarGroup>Loading...</ShadcnSidebarGroup>}>
      <ShadcnSidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const IconComponent = item.icon ? iconMap[item.icon] : undefined;
            return item.subItems ? (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
                defaultOpen={isActive(item.url)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {IconComponent && <IconComponent />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    {IconComponent && <IconComponent className="size-4 mr-2" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </ShadcnSidebarGroup>
    </Suspense>
  );
};
