import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { Entity } from '@prisma/client'

type SidebarContextType = {
    currentEntity: Entity | null
    loadEntity: (entity: Entity) => void
}

export const SidebarContext = createContext<SidebarContextType | null>(null)

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return { currentEntity: context.currentEntity, loadEntity: context.loadEntity }
}

export function SidebarProvider({ children }: PropsWithChildren) {

    const [currentEntity, setCurrentEntity] = useState<Entity | null>(null)


    return (
        <SidebarContext.Provider value={{
            currentEntity,
            loadEntity: (entity) => {
                console.log('loadEntity', entity)
                setCurrentEntity(entity)
            }
        }}>
            {children}
        </SidebarContext.Provider>
    )
}

