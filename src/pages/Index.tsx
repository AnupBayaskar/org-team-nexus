
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OrganizationForm from '@/components/OrganizationForm';
import OrganizationCard from '@/components/OrganizationCard';
import AppSidebar from '@/components/AppSidebar';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

interface Team {
  id: string;
  name: string;
  description: string;
  users: User[];
}

interface Organization {
  id: string;
  name: string;
  description: string;
  teams: Team[];
}

const Index = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const { toast } = useToast();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleCreateOrganization = (orgData: { name: string; description: string }) => {
    const newOrg: Organization = {
      id: generateId(),
      name: orgData.name,
      description: orgData.description,
      teams: [],
    };
    
    setOrganizations([...organizations, newOrg]);
    setShowOrgForm(false);
    
    toast({
      title: "Organization Created",
      description: `${orgData.name} has been successfully created.`,
    });
  };

  const handleDeleteOrganization = (orgId: string) => {
    const orgToDelete = organizations.find(org => org.id === orgId);
    setOrganizations(orgs => orgs.filter(org => org.id !== orgId));
    
    // Reset selected org if it was deleted
    if (selectedOrgId === orgId) {
      setSelectedOrgId(null);
    }
    
    toast({
      title: "Organization Deleted",
      description: `${orgToDelete?.name} has been successfully deleted.`,
      variant: "destructive",
    });
  };

  const handleAddTeam = (orgId: string, teamData: { name: string; description: string }) => {
    const newTeam: Team = {
      id: generateId(),
      name: teamData.name,
      description: teamData.description,
      users: [],
    };
    
    setOrganizations(orgs => 
      orgs.map(org => 
        org.id === orgId 
          ? { ...org, teams: [...org.teams, newTeam] }
          : org
      )
    );
    
    toast({
      title: "Team Created",
      description: `${teamData.name} has been added to the organization.`,
    });
  };

  const handleDeleteTeam = (orgId: string, teamId: string) => {
    setOrganizations(orgs => 
      orgs.map(org => 
        org.id === orgId 
          ? { ...org, teams: org.teams.filter(team => team.id !== teamId) }
          : org
      )
    );
    
    toast({
      title: "Team Deleted",
      description: "Team has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleAddUser = (
    orgId: string, 
    teamId: string, 
    userData: { name: string; email: string; role: string; isAdmin: boolean }
  ) => {
    const newUser: User = {
      id: generateId(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      isAdmin: userData.isAdmin,
    };
    
    setOrganizations(orgs => 
      orgs.map(org => 
        org.id === orgId 
          ? {
              ...org,
              teams: org.teams.map(team => 
                team.id === teamId
                  ? { ...team, users: [...team.users, newUser] }
                  : team
              )
            }
          : org
      )
    );
    
    toast({
      title: "User Added",
      description: `${userData.name} has been added to the team.`,
    });
  };

  const handleDeleteUser = (orgId: string, teamId: string, userId: string) => {
    setOrganizations(orgs => 
      orgs.map(org => 
        org.id === orgId 
          ? {
              ...org,
              teams: org.teams.map(team => 
                team.id === teamId
                  ? { ...team, users: team.users.filter(user => user.id !== userId) }
                  : team
              )
            }
          : org
      )
    );
    
    toast({
      title: "User Removed",
      description: "User has been successfully removed from the team.",
      variant: "destructive",
    });
  };

  const handleToggleUserAdmin = (orgId: string, teamId: string, userId: string) => {
    setOrganizations(orgs => 
      orgs.map(org => 
        org.id === orgId 
          ? {
              ...org,
              teams: org.teams.map(team => 
                team.id === teamId
                  ? { 
                      ...team, 
                      users: team.users.map(user => 
                        user.id === userId
                          ? { ...user, isAdmin: !user.isAdmin }
                          : user
                      ) 
                    }
                  : team
              )
            }
          : org
      )
    );
    
    toast({
      title: "Admin Status Updated",
      description: "User admin status has been successfully updated.",
    });
  };

  const filteredOrganizations = selectedOrgId 
    ? organizations.filter(org => org.id === selectedOrgId)
    : organizations;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-accent/20">
        <AppSidebar 
          organizations={organizations}
          selectedOrgId={selectedOrgId}
          onSelectOrganization={setSelectedOrgId}
        />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm border-b border-border/50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-main rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Organization Manager
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your organizations, teams, and members
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setShowOrgForm(true)}
              className="bg-gradient-main hover:opacity-90 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Organization
            </Button>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {showOrgForm && (
                <div className="mb-8">
                  <OrganizationForm 
                    onCreateOrganization={handleCreateOrganization}
                  />
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowOrgForm(false)}
                      className="hover:bg-muted"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {organizations.length === 0 ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-gradient-main rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-3">Welcome to Organization Manager</h2>
                    <p className="text-muted-foreground mb-6">
                      Get started by creating your first organization. You can then add teams and manage members effortlessly.
                    </p>
                    <Button
                      onClick={() => setShowOrgForm(true)}
                      size="lg"
                      className="bg-gradient-main hover:opacity-90 shadow-lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Organization
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedOrgId 
                          ? `Viewing: ${organizations.find(org => org.id === selectedOrgId)?.name}`
                          : 'All Organizations'
                        }
                      </h2>
                      <p className="text-muted-foreground">
                        {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    {selectedOrgId && (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedOrgId(null)}
                        className="hover:bg-muted"
                      >
                        View All Organizations
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-6">
                    {filteredOrganizations.map((org) => (
                      <OrganizationCard
                        key={org.id}
                        organization={org}
                        onAddTeam={handleAddTeam}
                        onAddUser={handleAddUser}
                        onDeleteOrganization={handleDeleteOrganization}
                        onDeleteTeam={handleDeleteTeam}
                        onDeleteUser={handleDeleteUser}
                        onToggleUserAdmin={handleToggleUserAdmin}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
