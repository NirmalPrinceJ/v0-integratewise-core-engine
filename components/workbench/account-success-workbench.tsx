'use client'

import { useState } from 'react'
import { DepartmentWorkbench } from './department-workbench'
import { EntityGrid } from './entity-grid'
import { EntityDetail } from './entity-detail'
import { useSpineEntities } from '@/lib/hooks/use-spine'
import type { SpineEntity } from '@/lib/types/spine'

export function AccountSuccessWorkbench() {
  const [activeEntity, setActiveEntity] = useState<SpineEntity | null>(null)
  const [selectedType, setSelectedType] = useState('account')
  const { entities: accounts, isLoading: accountsLoading } = useSpineEntities('account')
  const { entities: contacts } = useSpineEntities('contact')
  const { entities: invoices } = useSpineEntities('invoice')

  const allEntities = {
    account: accounts,
    contact: contacts,
    invoice: invoices,
  }

  const currentEntities = allEntities[selectedType as keyof typeof allEntities] || []

  return (
    <DepartmentWorkbench
      department="account-success"
      title="Account Success"
      description="Manage customer accounts, renewals, and health"
      icon="🏢"
      color="#3B82F6"
      activeEntity={activeEntity}
      entityTypes={[
        {
          id: '1',
          name: 'account',
          plural: 'accounts',
          icon: '🏢',
          color: '#3B82F6',
          category: 'CRM',
          fields: [],
          relationships: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'contact',
          plural: 'contacts',
          icon: '👤',
          color: '#8B5CF6',
          category: 'CRM',
          fields: [],
          relationships: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'invoice',
          plural: 'invoices',
          icon: '💵',
          color: '#059669',
          category: 'Finance',
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
            isLoading={accountsLoading}
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
