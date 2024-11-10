import { Assets } from "pixi.js";

export async function loadAssets(assets: string[]) {

    for (const asset of assets) {

        await Assets.load({
            src: asset,
            format: 'png',
            loadParser: 'loadTextures',
        })
    }
}
