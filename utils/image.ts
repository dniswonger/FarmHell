import { Assets } from "pixi.js";

const textureCache = new Set<string>();

export async function loadAssets(assets: string[]) {

    return Promise.all(assets.map((asset) => {
        return Assets.load({
            src: asset,
            format: 'png',
            loadParser: 'loadTextures',
        })
    }))
}

export async function preloadAssets(assets: string[]) {
    const newAssets = assets.filter(asset => !textureCache.has(asset));
    await loadAssets(newAssets);
    newAssets.forEach(asset => textureCache.add(asset));
}
