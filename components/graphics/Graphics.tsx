import { useMemo } from "react"
import { Graphics as PixiGraphics } from "pixi.js"
import { useStage } from "../stage/useStage"
import { Container, Text } from "pixi.js"
type GraphicsProps = {
    onClick: (graphics: PixiGraphics) => void
    x: number
    y: number
    width: number
    height?: number
    shape: 'circle' | 'rectangle'
}

export default function Graphics({ onClick, x, y, width, height = 100, shape = 'circle' }: GraphicsProps) {

    const { viewport, addChild } = useStage()

    const graphics = useMemo(() => {
        console.log('creating graphics')

        const scale = viewport?.scale
        if (!scale) return null
        const g = new PixiGraphics()
        if (shape == 'circle') {
            g.circle(x * scale.x, y * scale.y, width,)
        } else {
            g.rect(x * scale.x, y * scale.y, width, height)
        }
        g.fill({ color: 'red', alpha: 0.5 });
        g.zIndex = 1000
        g.interactive = true
        // if we add onClick to the dependency array we'll get additional renders because
        // onClick gets re-created on every render -- this leads to extra graphics components 
        // being created and rendered
        g.on('pointerdown', () => onClick(g))
        return g
    }, [x, y, width, height, shape, viewport])

    // useEffect(() => {
    //     return () => {
    //         if (graphics) graphics.destroy()
    //     }
    // }, [graphics])

    const t = new Text({ text: `${x}, ${y}`, style: { fill: 'white', fontSize: 20, fontFamily: 'Arial' }, x, y })
    t.zIndex = 1000

    if (!graphics) return null

    const container = new Container()
    container.addChild(graphics)
    container.addChild(t)
    container.zIndex = 1000

    addChild(container)

    return null
}