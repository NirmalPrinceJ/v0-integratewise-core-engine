'use client';

import { useState } from 'react';
import { OperationalTemplate } from '@/lib/core/templates/types';
import { TemplateCard } from './template-card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'all', name: 'All Templates', icon: '📋' },
  { id: 'sales', name: 'Sales', icon: '💰' },
  { id: 'csm', name: 'Customer Success', icon: '💚' },
  { id: 'marketing', name: 'Marketing', icon: '📢' },
  { id: 'finance', name: 'Finance', icon: '💵' },
  { id: 'ops', name: 'Operations', icon: '📌' },
  { id: 'product', name: 'Product', icon: '🗺️' },
];

interface TemplatesGridProps {
  templates: OperationalTemplate[];
  onCreateInstance?: (templateId: string) => void;
  instanceCounts?: Record<string, number>;
}

export function TemplatesGrid({
  templates,
  onCreateInstance,
  instanceCounts = {},
}: TemplatesGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTemplates = templates.filter(template => {
    const matchesDept = activeTab === 'all' || template.department === activeTab;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Department Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          {DEPARTMENTS.map(dept => (
            <TabsTrigger key={dept.id} value={dept.id} className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{dept.icon}</span>
              <span className="sm:ml-1">{dept.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Templates Grid */}
        <TabsContent value={activeTab} className="mt-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found. Try adjusting your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  instanceCount={instanceCounts[template.id] || 0}
                  onCreateInstance={onCreateInstance}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
