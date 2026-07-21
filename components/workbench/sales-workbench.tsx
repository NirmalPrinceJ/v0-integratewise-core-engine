'use client'

import { useState } from 'react'
import { DepartmentWorkbench } from './department-workbench'
import { EntityGrid } from './entity-grid'
import { EntityDetail } from './entity-detail'
import { useSpineEntities } from '@/lib/hooks/use-spine'
import type { SpineEntity } from '@/lib/types/spine'

export function SalesWorkbench() {
  const [activeEntity, setActiveEntity] = useState<SpineEntity | null>(null)
  const [selectedType, setSelectedType] = useState('deal')
  const { entities: deals, isLoading: dealsLoading } = useSpineEntities('deal')
  const { entities: leads } = useSpineEntities('lead')
  const { entities: opportunities } = useSpineEntities('opportunity')

  const allEntities = {
    deal: deals,
    lead: leads,
    opportunity: opportunities,
  }

  const currentEntities = allEntities[selectedType as keyof typeof allEntities] || []

  return (
    <DepartmentWorkbench
      department="sales"
      title="Sales Pipeline"
      description="Manage deals, leads, and opportunities"
      icon="💼"
      color="#10B981"
      activeEntity={activeEntity}
      entityTypes={[
        {
          id: '1',
          name: 'deal',
          plural: 'deals',
          icon: '💼',
          color: '#10B981',
          category: 'CRM',
          fields: [],
          relationships: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'lead',
          plural: 'leads',
          icon: '🔥',
          color: '#EF4444',
          category: 'CRM',
          fields: [],
          relationships: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'opportunity',
          plural: 'opportunities',
          icon: '🎯',
          color: '#F59E0B',
          category: 'CRM',
          fields: [],
          relationships: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]}
      onEntitySelect={setActiveEntity}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entity List */}
        <div className="lg:col-span-2">
          <EntityGrid
            entities={currentEntities}
            selectedEntity={activeEntity}
            onSelectEntity={setActiveEntity}
            isLoading={dealsLoading}
            type={selectedType}
          />
        </div>

        {/* Entity Detail */}
        {activeEntity && (
          <div className="lg:col-span-1">
            <EntityDetail entity={activeEntity} />
          </div>
        )}
      </div>
    </DepartmentWorkbench>
  )
}
