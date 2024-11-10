"use client";

import { Application, Sprite } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { Viewport } from "pixi-viewport";
import { loadAssets } from "@/utils/image";

export default function Home() {
  const appRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<string[]>([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {

    async function init() {


      async function load() {
        try {

          const blobArray: string[] = []
         

          // we should be resolving blob names based on the logged-in user. Since we don't have users/auth/accounts yet, just hardcode some blobs.
          const blobNames = ['Slices_01.jpg', 'Slices_02.jpg', 'Slices_03.jpg', 'Slices_04.jpg', 'Slices_05.jpg', 'Slices_06.jpg', 'Slices_09.jpg']

          for (const blobName of blobNames) {
            
            // get the SAS for each blob -- this is a url with a specific key for anonymous access. It will expire an an hour.
            const response = await fetch(`/api/images?blobName=${encodeURIComponent(blobName)}`);
            if (!response.ok) {
              throw new Error('Failed to get SAS URL');
            }

            const { sasUrl } = await response.json();

            // once we have the SAS we can get the actual blob from azure
            const imageResponse = await fetch(sasUrl);
            if (!imageResponse.ok) {
              throw new Error('Failed to download image');
            }

            const blob = await imageResponse.blob();
            
            // creates a url to access the blob (i.e. blob:http://localhost:3000/a7484d01-2015-4b40-92a3-abc5e53cea71)
            const url = URL.createObjectURL(blob);

            blobArray.push(url)
          }

          return blobArray
        } catch (error) {
          console.error('Error downloading image:', error);
          setLoading(false)
          throw error;
        }
      }

      setLoading(true)

      const blobs = await load()

      setData(blobs);

      setLoading(false)
    }

    init()
  }, [])

  useEffect(() => {
    async function initPixi() {
      const w = appRef.current?.clientWidth;
      const h = appRef.current?.clientHeight;
      const app = new Application();
      await app.init({ width: w, height: h, backgroundColor: 0x3e3e3e });
      // create viewport
      const viewport = new Viewport({
        screenWidth: w,
        screenHeight: h,
        events: app.renderer.events, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      });

      viewport.drag().pinch().wheel().decelerate();

      appRef.current?.appendChild(app.canvas);

      // data.forEach((image) => {
      //   const img = new Image();
      //   img.src = image.image64;
      //   const texture = Texture.from(img);
      //   const sprite = new Sprite(texture);
      //   sprite.x = image.x;
      //   sprite.y = image.y;
      //   viewport.addChild(sprite);
      // });

      //const textures = await Assets.load(data)

      await loadAssets(data)

      for (const a of data) {
        const sprite = Sprite.from(a)

        // width/height here?


        viewport.addChild(sprite);
      }
      app.stage.addChild(viewport);
    }
    initPixi();
  }, [data]);

  if (isLoading) return <div className="h-full w-full flex justify-center items-center"><p className="text-2xl text-green-500 ">LOADING</p></div>
  if (data.length == 0) return <div className="h-full w-full flex justify-center items-center"><p className="text-2xl text-green-500 ">NO IMAGE DATA</p></div>


  return (
    <div ref={appRef} className="h-full w-full">
    </div>)
}
