
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield,
  PlusCircle,
  Trash2,
  Phone,
  User,
  Power,
  Volume2,
} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

type Contact = {
  id: number;
  name: string;
  phone: string;
};

const mockContacts: Contact[] = [
  { id: 1, name: 'Asha Sharma', phone: '9876543210' },
  { id: 2, name: 'Police', phone: '100' },
];

export default function SafetyPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [powerButtonShortcut, setPowerButtonShortcut] = useState(false);
  const [volumeButtonShortcut, setVolumeButtonShortcut] = useState(false);
  const { toast } = useToast();

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) {
      toast({
        title: 'Error',
        description: 'Please enter both name and phone number.',
        variant: 'destructive',
      });
      return;
    }
    const newContact: Contact = {
      id: Date.now(),
      name: newContactName,
      phone: newContactPhone,
    };
    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    toast({
      title: 'Success!',
      description: `${newContact.name} has been added to your emergency contacts.`,
    });
  };

  const handleDeleteContact = (contactId: number) => {
    const contactToDelete = contacts.find((contact) => contact.id === contactId);
    setContacts(contacts.filter((contact) => contact.id !== contactId));
    toast({
      title: 'Contact Removed',
      description: `${contactToDelete?.name} has been removed from your emergency list.`,
    });
  };

  const handleShortcutToggle = (type: 'power' | 'volume', enabled: boolean) => {
    const featureName = type === 'power' ? 'Power button shortcut' : 'Volume button shortcut';
    
    if (type === 'power') setPowerButtonShortcut(enabled);
    if (type === 'volume') setVolumeButtonShortcut(enabled);
    
    toast({
      title: `${featureName} ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `This feature is simulated. In a real app, this would be active.`,
    });
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Safety Settings</h1>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Manage your emergency contacts and customize how you activate SOS alerts.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>
              When you activate an SOS alert, a notification will be sent to these contacts. The message will include your name and current work location for a quick response.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                  <h4 className="font-semibold text-sm">Example Message Format:</h4>
                  <p className="text-sm text-muted-foreground italic">
                    "Emergency alert from VaSa: [Your Name] is in danger at [Your Current Job Location]. Please respond immediately."
                  </p>
            </div>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <User className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove {contact.name} from your
                          emergency contacts.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteContact(contact.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddContact} className="space-y-4 pt-6 border-t">
              <h3 className="font-semibold">Add New Contact</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input
                    id="contact-name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g., Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone Number</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="e.g., 9988776655"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>SOS Activation Shortcuts</CardTitle>
            <CardDescription>
              Set up hardware button shortcuts to activate SOS without opening the app.
              <span className="mt-2 block font-semibold text-amber-600">
                Note: These features are simulated for this web demo.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center gap-4">
                  <Power className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <Label htmlFor="power-button-switch" className="font-semibold cursor-pointer">
                      Press Power Button 3 Times
                    </Label>
                     <p className="text-sm text-muted-foreground">Quickly press the power button three times to send an alert.</p>
                  </div>
                </div>
                 <Switch
                    id="power-button-switch"
                    checked={powerButtonShortcut}
                    onCheckedChange={(checked) => handleShortcutToggle('power', checked)}
                  />
            </div>

            <div className="flex items-center justify-between rounded-md border p-4">
               <div className="flex items-center gap-4">
                  <Volume2 className="h-6 w-6 text-muted-foreground" />
                  <div>
                     <Label htmlFor="volume-button-switch" className="font-semibold cursor-pointer">
                        Hold Volume Down Button
                     </Label>
                     <p className="text-sm text-muted-foreground">Hold the volume down button for 3 seconds to send an alert.</p>
                  </div>
                </div>
                 <Switch
                    id="volume-button-switch"
                    checked={volumeButtonShortcut}
                    onCheckedChange={(checked) => handleShortcutToggle('volume', checked)}
                  />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
