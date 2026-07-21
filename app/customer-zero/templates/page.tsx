'use client';

import { useState } from 'react';
import { useTemplates } from '@/lib/hooks/use-templates';
import { TemplatesGrid } from '@/components/templates/templates-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export default function TemplatesPage() {
  const {
    templates,
    instances,
    loading,
    createInstance,
    getActiveInstances,
  } = useTemplates();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const instanceCounts = templates.reduce(
    (acc, template) => {
      acc[template.id] = getActiveInstances(template.id).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const handleCreateInstance = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowCreateDialog(true);
  };

  const handleConfirmCreate = () => {
    if (!newInstanceName.trim() || !selectedTemplateId) return;

    const instance = createInstance(selectedTemplateId, 'current-user', {
      name: newInstanceName,
    });

    if (instance) {
      setNewInstanceName('');
      setShowCreateDialog(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Operational Templates</h1>
        <p className="text-muted-foreground">
          Pre-configured templates for running every aspect of your company. Built-in fields, views, actions, and integrations for each department.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Instances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {instances.filter(i => i.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(templates.map(t => t.department)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(templates.flatMap(t => t.integrations)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="h-4 w-4" />
            Template Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Each template includes pre-configured fields, views, actions, and integrations tailored to specific operational needs. Create instances to start using templates for your team.
          </p>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <TemplatesGrid
        templates={templates}
        onCreateInstance={handleCreateInstance}
        instanceCounts={instanceCounts}
      />

      {/* Create Instance Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Template Instance</DialogTitle>
            <DialogDescription>
              Create a new instance of this template for your team to use
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Instance Name</label>
              <Input
                placeholder="e.g., Q1 2025 Sales Pipeline"
                value={newInstanceName}
                onChange={e => setNewInstanceName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewInstanceName('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmCreate}
                disabled={!newInstanceName.trim() || loading}
              >
                {loading ? 'Creating...' : 'Create Instance'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
