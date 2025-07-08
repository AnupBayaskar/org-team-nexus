
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';

interface TeamFormProps {
  onCreateTeam: (team: { name: string; description: string }) => void;
  onCancel: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ onCreateTeam, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; description?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Team name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onCreateTeam({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
    setErrors({});
  };

  return (
    <Card className="w-full shadow-md border-0 bg-gradient-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Users className="h-4 w-4" />
          Create New Team
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name" className="text-sm font-medium">
              Team Name
            </Label>
            <Input
              id="team-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Enter team name"
              className={`transition-all duration-200 ${
                errors.name ? 'border-destructive ring-destructive' : 'focus:ring-primary'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="team-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="Describe this team"
              rows={2}
              className={`transition-all duration-200 resize-none ${
                errors.description ? 'border-destructive ring-destructive' : 'focus:ring-primary'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description}</p>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-main hover:opacity-90 transition-all duration-200 shadow-sm"
            >
              Create Team
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 hover:bg-muted transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamForm;
