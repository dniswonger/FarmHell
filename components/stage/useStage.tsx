
import { useContext, createContext } from "react";
import { Container } from "pixi.js";
import { Viewport } from "pixi-viewport";


export const StageContext = createContext<{ addChild: (child: Container) => void, viewport: Viewport | null } | null>(null);

export function useStage() {
    const context = useContext(StageContext)
    if (!context) throw new Error('useStage must be used within a Stage')
    const { addChild, viewport } = context
    return { addChild, viewport }

}