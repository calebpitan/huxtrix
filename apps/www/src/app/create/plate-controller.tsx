'use client'

import { PlateController } from 'platejs/react'

export function CreatePlateController({ children }: { children: React.ReactNode }) {
  return <PlateController>{children}</PlateController>
}
