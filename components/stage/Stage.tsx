import { useRef, useEffect, useState, createContext } from "react";
import { Application, Container } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { StageContext } from "./useStage";

type StageProps = {
    children: React.ReactNode,
}

export default function Stage({ children }: StageProps) {

    const stageRef = useRef<HTMLDivElement>(null);
    const [viewport, setViewport] = useState<Viewport | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    function handleAddChild(child: Container) {
        if (viewport == null) throw new Error('Stage must be initialized before adding children')
        viewport.addChild(child)
    }

    useEffect(() => {
        // init pixi app
        async function init(app: Application) {

            setIsLoading(true)

            if (stageRef.current == null) throw new Error('Stage cannot find a suitable ref')

            await app.init({ width: stageRef.current.clientWidth, height: stageRef.current.clientHeight, backgroundColor: 0x3e3e3e });

            // viewport allows for zooming, panning, and scrolling
            // app.renderer.events is important for wheel to work properly when renderer.view is placed or scaled
            const viewport = new Viewport({
                screenWidth: app.screen.width,
                screenHeight: app.screen.height,
                events: app.renderer.events,
            });

            viewport.drag().pinch().wheel().decelerate();

            app.stage.addChild(viewport)

            stageRef.current.appendChild(app.canvas);

            setViewport(viewport)
            setIsLoading(false)
        }

        const app = new Application();
        init(app)

        return () => {
            app.destroy(true)
        }
    }, [])

    return (
        <StageContext.Provider value={{ addChild: handleAddChild }}>
            <div ref={stageRef} className="w-full h-full">
                {!isLoading && children}
            </div>
        </StageContext.Provider>
    )
}
