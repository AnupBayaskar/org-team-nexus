
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from 'lucide-react';

interface UserFormProps {
  onAddUser: (user: { name: string; email: string; role: string; isAdmin: boolean }) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onAddUser, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string }>({});

  const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Tester', 'Product Owner'];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; email?: string; role?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!role) {
      newErrors.role = 'Role is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onAddUser({ 
      name: name.trim(), 
      email: email.trim(), 
      role, 
      isAdmin 
    });
    
    setName('');
    setEmail('');
    setRole('');
    setIsAdmin(false);
    setErrors({});
  };

  return (
    <Card className="w-full shadow-md border-0 bg-gradient-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
          <User className="h-4 w-4" />
          Add Team Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="Enter full name"
                className={`transition-all duration-200 ${
                  errors.name ? 'border-destructive ring-destructive' : 'focus:ring-primary'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="Enter email address"
                className={`transition-all duration-200 ${
                  errors.email ? 'border-destructive ring-destructive' : 'focus:ring-primary'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user-role" className="text-sm font-medium">
              Role
            </Label>
            <Select value={role} onValueChange={(value) => {
              setRole(value);
              if (errors.role) setErrors({ ...errors, role: undefined });
            }}>
              <SelectTrigger className={`transition-all duration-200 ${
                errors.role ? 'border-destructive ring-destructive' : 'focus:ring-primary'
              }`}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {roles.map((roleOption) => (
                  <SelectItem key={roleOption} value={roleOption}>
                    {roleOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-destructive mt-1">{errors.role}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="admin-checkbox" 
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label 
              htmlFor="admin-checkbox" 
              className="text-sm font-medium cursor-pointer"
            >
              Make this user a team admin
            </Label>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-main hover:opacity-90 transition-all duration-200 shadow-sm"
            >
              Add User
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

export default UserForm;
