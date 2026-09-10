import veteranFixture from '../data/veteran.json'
import benefitsFixture from '../data/benefits.json'
import actionItemsFixture from '../data/actionItems.json'
import type { DashboardData } from '../types'

const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export async function fetchDashboardData(): Promise<DashboardData> {
  await delay(450)
  return structuredClone({
    veteran: veteranFixture,
    benefits: benefitsFixture,
    actionItems: actionItemsFixture,
  }) as DashboardData
}
