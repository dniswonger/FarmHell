import { Sprite as PixiSprite } from 'pixi.js';
import { useEffect, useRef } from 'react';
//import { loadAssets } from '@/utils/image';
import { useStage } from '@/components/stage/useStage';

interface SpriteProps {
    texture: string;  // URL or path to the image
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    anchor?: { x: number; y: number };
}

export function Sprite({
    texture,
    x = 0,
    y = 0,
    width,
    height,
    rotation = 0,
    anchor = { x: 0, y: 0 },
}: SpriteProps) {
    const spriteRef = useRef<PixiSprite | null>(null);

    const { addChild } = useStage()

    // const url = new URL(texture)
    // console.log('texture url')
    // console.log(url)
    

    //const [getTexture, loadTexture] = useTextureCache()

    useEffect(() => {
        async function load() {

            // load the texture
            //await loadAssets([texture])
            //const t = await useTextureCache(texture)

            // Create sprite
            if (texture) {
                const sprite = PixiSprite.from(texture);
                sprite.x = x
                sprite.y = y
                sprite.width = width || sprite.width
                sprite.height = height || sprite.height
                sprite.rotation = rotation
                sprite.anchor.set(anchor.x, anchor.y);

                spriteRef.current = sprite;

                // add sprite to stage
                addChild(sprite)
            }
        }

        load()
    }, [texture, addChild, x, y, width, height, rotation, anchor]); // Recreate sprite if texture changes

    // Update properties when they change
    useEffect(() => {
        const sprite = spriteRef.current;
        if (!sprite) return;

        Object.assign(sprite, {
            x,
            y,
            width: width || sprite.width,
            height: height || sprite.height,
            rotation
        });
        sprite.anchor.set(anchor.x, anchor.y);

    }, [x, y, width, height, rotation, anchor]);

    return null; // This component doesn't render any DOM elements
}