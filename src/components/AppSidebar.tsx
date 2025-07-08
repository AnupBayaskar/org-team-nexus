
import React from 'react';
import { Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface Organization {
  id: string;
  name: string;
  description: string;
  teams: Team[];
}

interface Team {
  id: string;
  name: string;
  description: string;
  users: User[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

interface AppSidebarProps {
  organizations: Organization[];
  selectedOrgId: string | null;
  onSelectOrganization: (orgId: string | null) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  organizations, 
  selectedOrgId, 
  onSelectOrganization 
}) => {
  const { collapsed } = useSidebar();

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            Organizations
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedOrgId === null}
                  onClick={() => onSelectOrganization(null)}
                  className="hover:bg-accent transition-colors duration-200"
                >
                  <Users className="h-4 w-4" />
                  {!collapsed && <span>All Organizations</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {organizations.map((org) => {
                const totalUsers = org.teams.reduce((sum, team) => sum + team.users.length, 0);
                
                return (
                  <SidebarMenuItem key={org.id}>
                    <SidebarMenuButton 
                      isActive={selectedOrgId === org.id}
                      onClick={() => onSelectOrganization(org.id)}
                      className="hover:bg-accent transition-colors duration-200"
                    >
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <Users className="h-3 w-3 text-primary" />
                      </div>
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{org.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {org.teams.length} teams • {totalUsers} members
                          </p>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
