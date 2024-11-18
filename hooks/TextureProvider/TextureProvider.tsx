
import { createContext, useContext, useCallback } from "react"
import { Texture } from "pixi.js"
import { loadAssets } from "@/utils/image"

type TextureContextType = {
    textureMap: Map<string, string>
}

export const TextureContext = createContext<TextureContextType | null>(null)

export function TextureProvider({ children, map }: { children: React.ReactNode, map: Map<string, string> }) {

    console.log('creating new TextureProvider map')
    //const textureMap = new Map<string, string>()
    const textureMap = map

    return (
        <TextureContext.Provider value={{ textureMap }}>
            {children}
        </TextureContext.Provider>)
}

export function useTextureCache() : [
    (name: string) => string | undefined,
    (textureName: string, url: string) => Promise<Texture | null>] {
    const context = useContext(TextureContext)

    if (!context) {
        throw new Error('useTextureCache must be used within a TextureProvider')
    }

    const map = context.textureMap

   

    const getTexture = useCallback(function getTexture(name: string) {
        return map.get(name)
    }, [map])

    const loadTexture = useCallback(async function loadTexture(textureName: string, url: string) {
        let tex: Texture | null = null
        if (map.has(textureName)) {
            const textureUrl = map.get(textureName)!
            const assetArray = await loadAssets([textureUrl])
            tex = assetArray[0]
        }
        else {
            map.set(textureName, url)
            const assetArray = await loadAssets([url])
            tex = assetArray[0]
        }

        return tex
    }, [map])

    return [getTexture, loadTexture]
}

export default TextureProvider