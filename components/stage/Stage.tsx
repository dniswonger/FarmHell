import { useRef, useEffect, useState } from "react";
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

    // function handleAddGraphic(child: Graphics) {
    //     if (viewport == null) throw new Error('Stage must be initialized before adding children')

    //     console.log('adding graphics')
        
    //     const coords = viewport.toScreen(child.x, child.y)
    //     child.x = coords.x
    //     child.y = coords.y

    //     console.log(child.x, child.y)


    //     viewport.addChild(child)
    // }

    useEffect(() => {

        // init pixi app
        async function init(app: Application) {

            setIsLoading(true)

            if (stageRef.current == null) throw new Error('Stage cannot find a suitable ref')

            // resize the viewport when the browser window is resized
            window.addEventListener('resize', () => app.renderer.resize(stageRef.current?.clientWidth ?? 0, stageRef.current?.clientHeight ?? 0))

            await app.init({ width: stageRef.current.clientWidth, height: stageRef.current.clientHeight, backgroundColor: 0x3e3e3e });

            // viewport allows for zooming, panning, and scrolling
            // app.renderer.events is important for wheel to work properly when renderer.view is placed or scaled
            const viewport = new Viewport({
                events: app.renderer.events,
            });

            viewport.drag().pinch().wheel().decelerate()

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

    console.log(children)

    return (
        <StageContext.Provider value={{ addChild: handleAddChild, viewport: viewport }}>
            <div ref={stageRef} className="w-full h-full" >
                {!isLoading && children}
            </div>
        </StageContext.Provider>
    )
}
