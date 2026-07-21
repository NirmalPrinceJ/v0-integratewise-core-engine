/**
 * Workbench Page
 * Main entry point for the User Workbench - the unified operational hub
 * for every department combining Spine data, Twin context, and OODA actions
 */

import { Metadata } from 'next'
import { WorkbenchRouter } from '@/components/workbench/workbench-router'

export const metadata: Metadata = {
  title: 'Workbench | IntegrateWise',
  description: 'User Workbench - Department-aware workspace with Spine data and Twin intelligence',
}

export default function WorkbenchPage() {
  return <WorkbenchRouter />
}
