
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ChevronDown, ChevronRight, Plus, Users, User, Trash2, Shield, ShieldOff } from 'lucide-react';
import TeamForm from './TeamForm';
import UserForm from './UserForm';

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

interface OrganizationCardProps {
  organization: Organization;
  onAddTeam: (orgId: string, team: { name: string; description: string }) => void;
  onAddUser: (orgId: string, teamId: string, user: { name: string; email: string; role: string; isAdmin: boolean }) => void;
  onDeleteOrganization: (orgId: string) => void;
  onDeleteTeam: (orgId: string, teamId: string) => void;
  onDeleteUser: (orgId: string, teamId: string, userId: string) => void;
  onToggleUserAdmin: (orgId: string, teamId: string, userId: string) => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ 
  organization, 
  onAddTeam, 
  onAddUser,
  onDeleteOrganization,
  onDeleteTeam,
  onDeleteUser,
  onToggleUserAdmin
}) => {
  const [isOrgOpen, setIsOrgOpen] = useState(true);
  const [openTeams, setOpenTeams] = useState<Set<string>>(new Set());
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState<string | null>(null);

  const toggleTeam = (teamId: string) => {
    const newOpenTeams = new Set(openTeams);
    if (newOpenTeams.has(teamId)) {
      newOpenTeams.delete(teamId);
    } else {
      newOpenTeams.add(teamId);
    }
    setOpenTeams(newOpenTeams);
  };

  const handleAddTeam = (teamData: { name: string; description: string }) => {
    onAddTeam(organization.id, teamData);
    setShowTeamForm(false);
  };

  const handleAddUser = (userData: { name: string; email: string; role: string; isAdmin: boolean }) => {
    if (showUserForm) {
      onAddUser(organization.id, showUserForm, userData);
      setShowUserForm(null);
    }
  };

  const totalUsers = organization.teams.reduce((sum, team) => sum + team.users.length, 0);

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-card">
      <Collapsible open={isOrgOpen} onOpenChange={setIsOrgOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors duration-200 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary">{organization.name}</h3>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    {organization.teams.length} teams • {totalUsers} members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{organization.name}"? This action cannot be undone and will remove all teams and users within this organization.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteOrganization(organization.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {isOrgOpen ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <p className="text-muted-foreground mb-6">{organization.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Teams</h4>
                <Button
                  onClick={() => setShowTeamForm(true)}
                  size="sm"
                  className="bg-gradient-main hover:opacity-90 shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Team
                </Button>
              </div>
              
              {showTeamForm && (
                <div className="mb-4">
                  <TeamForm
                    onCreateTeam={handleAddTeam}
                    onCancel={() => setShowTeamForm(false)}
                  />
                </div>
              )}
              
              {organization.teams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No teams yet. Create your first team to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {organization.teams.map((team) => (
                    <Card key={team.id} className="border shadow-sm">
                      <Collapsible 
                        open={openTeams.has(team.id)} 
                        onOpenChange={() => toggleTeam(team.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-md">
                                  <Users className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <h5 className="font-semibold">{team.name}</h5>
                                  <p className="text-sm text-muted-foreground">
                                    {team.users.length} members
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Team</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{team.name}"? This action cannot be undone and will remove all users from this team.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => onDeleteTeam(organization.id, team.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                {openTeams.has(team.id) ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground mb-4">{team.description}</p>
                            
                            <div className="flex items-center justify-between mb-3">
                              <h6 className="font-medium">Team Members</h6>
                              <Button
                                onClick={() => setShowUserForm(team.id)}
                                size="sm"
                                variant="outline"
                                className="hover:bg-primary hover:text-primary-foreground"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Member
                              </Button>
                            </div>
                            
                            {showUserForm === team.id && (
                              <div className="mb-4">
                                <UserForm
                                  onAddUser={handleAddUser}
                                  onCancel={() => setShowUserForm(null)}
                                />
                              </div>
                            )}
                            
                            {team.users.length === 0 ? (
                              <div className="text-center py-6 text-muted-foreground">
                                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No team members yet.</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {team.users.map((user) => (
                                  <div 
                                    key={user.id} 
                                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border"
                                  >
                                    <div className="p-2 bg-background rounded-full">
                                      <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm truncate">{user.name}</p>
                                        {user.isAdmin && (
                                          <Badge variant="secondary" className="text-xs px-2 py-0">
                                            Admin
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                      <p className="text-xs text-primary font-medium">{user.role}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onToggleUserAdmin(organization.id, team.id, user.id)}
                                        className="h-8 w-8 p-0 hover:bg-primary/10"
                                        title={user.isAdmin ? "Remove admin" : "Make admin"}
                                      >
                                        {user.isAdmin ? (
                                          <ShieldOff className="h-3 w-3 text-orange-600" />
                                        ) : (
                                          <Shield className="h-3 w-3 text-green-600" />
                                        )}
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Remove User</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to remove "{user.name}" from this team? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => onDeleteUser(organization.id, team.id, user.id)}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              Remove
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default OrganizationCard;
