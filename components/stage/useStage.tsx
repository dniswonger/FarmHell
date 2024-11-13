
import { useContext, createContext } from "react";
import { Container } from "pixi.js";

export const StageContext = createContext<{ addChild: (child: Container) => void } | null>(null);

export function useStage() {
    const context = useContext(StageContext)
    if (!context) throw new Error('useStage must be used within a Stage')
    const { addChild } = context
    return { addChild }

}