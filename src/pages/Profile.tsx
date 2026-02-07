import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Mail, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, signOut } = useAuthContext();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    const { error } = await api.updateUser(user.id, { name, email });
    setIsSaving(false);

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(38 92% 60% / 0.15) 0%, transparent 70%)',
        }}
      />

      <header className="sticky top-0 z-10 glass border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Decisions
          </Link>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <User className="h-5 w-5 text-primary" />
              </div>
              Your Profile
            </CardTitle>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input border-border"
                  />
                ) : (
                  <p className="text-foreground py-2 px-3 rounded-md bg-secondary/50">
                    {user?.name || 'Not set'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border"
                  />
                ) : (
                  <p className="text-foreground py-2 px-3 rounded-md bg-secondary/50">
                    {user?.email || 'Not set'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">User ID</Label>
                <p className="text-sm text-muted-foreground py-2 px-3 rounded-md bg-secondary/50 font-mono">
                  {user?.id || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || '');
                      setEmail(user?.email || '');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="accent"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="accent"
                  onClick={() => setIsEditing(true)}
                  className="flex-1"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={signOut}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
