'use client';

import { useState, useEffect } from 'react';
import { lifecycleEngine, recurringScheduler, LIFECYCLE_CATEGORIES, RECURRING_DOMAINS } from '@/lib/core/lifecycle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Zap, Clock, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LifecycleView() {
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [dueRecurringEvents, setDueRecurringEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('sales');
  const [selectedDomain, setSelectedDomain] = useState<string>('founder');

  useEffect(() => {
    // Get recent events
    const recent = lifecycleEngine.getRecentEvents(20);
    setRecentEvents(recent);

    // Get due recurring events
    const due = recurringScheduler.getDueEvents();
    setDueRecurringEvents(due);
  }, []);

  const categories = Object.keys(LIFECYCLE_CATEGORIES);
  const domains = Object.keys(RECURRING_DOMAINS);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Lifecycle & Recurring Events</h2>
        <p className="text-muted-foreground">
          27 lifecycle categories + 15 recurring event domains powering all operations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lifecycle Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">From Strategy to Governance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentEvents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 20 lifecycle events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recurring Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Daily, weekly, monthly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Due Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dueRecurringEvents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 1 hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Lifecycle Categories */}
      <Tabs defaultValue="lifecycle" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lifecycle">Lifecycle Categories</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Events</TabsTrigger>
          <TabsTrigger value="recent">Recent Events</TabsTrigger>
        </TabsList>

        <TabsContent value="lifecycle" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => {
              const events = LIFECYCLE_CATEGORIES[category as any] || [];
              const tools = lifecycleEngine.getConnectedTools(category as any);

              return (
                <Card
                  key={category}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base capitalize">{category.replace('-', ' ')}</CardTitle>
                        <CardDescription>{events.length} events</CardDescription>
                      </div>
                      <Zap className="h-4 w-4 text-yellow-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Connected Tools</p>
                      <div className="flex flex-wrap gap-1">
                        {tools.slice(0, 3).map(tool => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                        {tools.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tools.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Sample Events</p>
                      <div className="text-xs space-y-1">
                        {events.slice(0, 3).map(event => (
                          <div key={event} className="text-muted-foreground capitalize">
                            • {event.replace(/-/g, ' ')}
                          </div>
                        ))}
                        {events.length > 3 && (
                          <div className="text-muted-foreground">• +{events.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recurring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domains.map(domain => {
              const domainData = RECURRING_DOMAINS[domain];
              const allEvents = recurringScheduler.getDomainEvents(domain);
              const tools = recurringScheduler.getConnectedTools(domain);

              return (
                <Card key={domain} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{domainData.name}</CardTitle>
                        <CardDescription>{allEvents.length} events across cadences</CardDescription>
                      </div>
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Cadences</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(domainData.cadences).map(cadence => (
                          <Badge
                            key={cadence}
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {cadence}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Connected Tools</p>
                      <div className="flex flex-wrap gap-1">
                        {tools.slice(0, 3).map(tool => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentEvents.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No recent events yet. Lifecycle events will appear as they are emitted.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {recentEvents.map(event => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium capitalize">{event.eventType.replace(/-/g, ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        Category: <span className="capitalize">{event.category}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {event.connectedTools.slice(0, 2).map(tool => (
                        <Badge key={tool} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Due Recurring Events Alert */}
      {dueRecurringEvents.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <TrendingUp className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>{dueRecurringEvents.length} recurring events</strong> due in the next hour
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
