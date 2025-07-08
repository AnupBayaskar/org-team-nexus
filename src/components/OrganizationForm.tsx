
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

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

interface OrganizationFormProps {
  onCreateOrganization: (org: Omit<Organization, 'id' | 'teams'>) => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ onCreateOrganization }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; description?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Organization name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onCreateOrganization({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
    setErrors({});
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-gradient-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Plus className="h-5 w-5" />
          Create Organization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name" className="text-sm font-medium">
              Organization Name
            </Label>
            <Input
              id="org-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Enter organization name"
              className={`transition-all duration-200 ${
                errors.name ? 'border-destructive ring-destructive' : 'focus:ring-primary'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="org-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="org-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="Describe your organization"
              rows={3}
              className={`transition-all duration-200 resize-none ${
                errors.description ? 'border-destructive ring-destructive' : 'focus:ring-primary'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-main hover:opacity-90 transition-all duration-200 shadow-sm"
          >
            Create Organization
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrganizationForm;
