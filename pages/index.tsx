"use client";

import "@/globals.css";
import { BlobServiceClient } from "@azure/storage-blob";
import { GetStaticProps, InferGetStaticPropsType } from "next/types";
import { Application, Sprite, Texture } from "pixi.js";
import { useEffect, useRef } from "react";
import { Viewport } from "pixi-viewport";

type ImageDef = {
  name: string;
  image64: string;
  x: number;
  y: number;
};
const xStep = 4749;
const yStep = 5247;

export const getStaticProps = (async () => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING ?? ""
  );

  const client = blobServiceClient.getContainerClient("images");

  const images: ImageDef[] = [];
  const gridDimensionX = 3;
  const gridDemensionY = 3;

  for await (const blob of client.listBlobsFlat()) {
    const tempBlockBlobClient = client.getBlockBlobClient(blob.name);

    // assume 3 column tiled image that ends in '_X' where X%3 is the column number (1 based)
    const rawNum = blob.name.substring(
      blob.name.lastIndexOf("_") + 1,
      blob.name.lastIndexOf(".")
    );

    const buf = await tempBlockBlobClient.downloadToBuffer();
    const currentX = (parseInt(rawNum) - 1) % gridDimensionX;
    const currentY = Math.floor((parseInt(rawNum) - 1) / gridDemensionY);

    const base64String = "data:image/png;base64," + buf.toString("base64");

    images.push({
      name: blob.name,
      image64: base64String,
      x: currentX * xStep,
      y: currentY * yStep,
    } satisfies ImageDef);
  }

  return { props: { images } };
}) satisfies GetStaticProps<{ images: ImageDef[] }>;

export default function Home({
  images,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const appRef = useRef<HTMLDivElement>(null);

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

      images.forEach((image) => {
        const img = new Image();
        img.src = image.image64;
        const texture = Texture.from(img);
        const sprite = new Sprite(texture);
        sprite.x = image.x;
        sprite.y = image.y;
        viewport.addChild(sprite);
      });

      app.stage.addChild(viewport);
    }
    initPixi();
  }, [images]);

  return <div ref={appRef} className="h-full w-full"></div>;
}
