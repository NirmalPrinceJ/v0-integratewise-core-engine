'use client';

import { OperationalTemplate } from '@/lib/core/templates/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';

interface TemplateCardProps {
  template: OperationalTemplate;
  instanceCount?: number;
  onCreateInstance?: (templateId: string) => void;
  className?: string;
}

export function TemplateCard({
  template,
  instanceCount = 0,
  onCreateInstance,
  className,
}: TemplateCardProps) {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    violet: 'bg-violet-50 border-violet-200 text-violet-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    slate: 'bg-slate-50 border-slate-200 text-slate-900',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-900',
  };

  const borderColorMap: Record<string, string> = {
    emerald: 'border-l-emerald-500',
    blue: 'border-l-blue-500',
    violet: 'border-l-violet-500',
    amber: 'border-l-amber-500',
    slate: 'border-l-slate-500',
    cyan: 'border-l-cyan-500',
  };

  return (
    <Card className={`border-l-4 ${borderColorMap[template.color]} ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-3xl">{template.icon}</div>
            <div className="flex-1">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
            </div>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${colorMap[template.color]}`}>
            {template.department}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{template.purpose}</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-background p-2 rounded">
            <div className="text-muted-foreground">Sections</div>
            <div className="font-semibold">{template.sections.length}</div>
          </div>
          <div className="bg-background p-2 rounded">
            <div className="text-muted-foreground">Active</div>
            <div className="font-semibold">{instanceCount}</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Integrations:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {template.integrations.slice(0, 3).map(int => (
              <span key={int} className="bg-background px-2 py-1 rounded">
                {int}
              </span>
            ))}
            {template.integrations.length > 3 && (
              <span className="bg-background px-2 py-1 rounded">
                +{template.integrations.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onCreateInstance?.(template.id)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Create
          </Button>
          <Link href={`/customer-zero/templates/${template.id}`} className="flex-1">
            <Button size="sm" variant="ghost" className="w-full">
              View <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
