import { useEffect, useState } from "react";
import Stage from "@/components/stage/Stage";
import { Sprite } from "@/components/sprite/Sprite";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { useTextureCache } from "@/hooks/TextureProvider/TextureProvider";
import { PrismaClient, Prisma, Entity as PrismaEntity } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";
import Entity from "@/components/entity/Entity";
import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/components/sidebar/useSidebar";

type UserWithTileset = Prisma.UserGetPayload<{
  include: { tileset: true }
}>

export const getServerSideProps = (async ({ req }) => {

  const { userId } = getAuth(req)
  let entities: PrismaEntity[] = []

  const prisma = new PrismaClient().$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY ?? '' }))
  let user: UserWithTileset | null = null

  if (userId) {
    user = await prisma.user.findUnique({
      where: {
        oauthid: userId
      },
      include: {
        tileset: true  // This includes the related tileset in the response
      }
    })

    // entities = await prisma.entity.findMany({
    //   where: {
    //     tilesetid: user?.tileset?.id
    //   }
    // })

    const temp = await prisma.entity.findFirst({
      where: {
        tilesetid: user?.tileset?.id,
        dateplanted: {
          not: null
        }
      }
    })

    if (temp) entities = [temp]

    // if the user doesn't exist in our database, create them
    if (!user) {

      const client = await clerkClient()
      const userDetails = userId ? await client.users.getUser(userId) : undefined

      user = await prisma.user.create({
        data: {
          name: userDetails?.firstName + " " + userDetails?.lastName,
          email: userDetails?.emailAddresses[0].emailAddress,
          oauthid: userDetails?.id,
          tileset: {
            create: {
              name: "Default",
              tiles: ['Slices_01.jpg', 'Slices_02.jpg', 'Slices_03.jpg', 'Slices_04.jpg', 'Slices_05.jpg', 'Slices_06.jpg', 'Slices_09.jpg'],
              width: 3,
              height: 3,
            }
          }
        },
        include: {
          tileset: true
        }
      })
    }
  }
  return { props: { user, entities } }
}) satisfies GetServerSideProps<{ user: UserWithTileset | null, entities: PrismaEntity[] }>

export default function Home({ user, entities }: InferGetServerSidePropsType<typeof getServerSideProps>) {


  const [data, setData] = useState<Tile[]>([])
  const [isLoading, setLoading] = useState(true)
  const [getTexture, loadTexture] = useTextureCache()

  type Tile = {
    url: string,
    x: number,
    y: number,
    width: number,
    height: number
  }
  const xStep = 4749;
  const yStep = 5247;

  useEffect(() => {

    async function load() {
      try {

        setLoading(true)

        const tileArray: Tile[] = []

        const gridDimensionX = user?.tileset?.width ?? 3
        const gridDimensionY = user?.tileset?.height ?? 3

        for (const blobName of user?.tileset?.tiles ?? []) {

          // do we already have this texture?
          let blobUrl = getTexture(blobName)

          if (blobUrl == null) {
            // get the SAS for each blob -- this is a url with a specific key for anonymous access. It will expire an an hour.
            // TODO: we should cache this SAS url so we don't have to hit the server every time.
            // TODO: use react-query
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
            blobUrl = URL.createObjectURL(blob);
          }

          // cache and load the texture
          await loadTexture(blobName, blobUrl)

          const rawNum = blobName.substring(
            blobName.lastIndexOf("_") + 1,
            blobName.lastIndexOf(".")
          );

          const currentX = (parseInt(rawNum) - 1) % gridDimensionX;
          const currentY = Math.floor((parseInt(rawNum) - 1) / gridDimensionY);

          tileArray.push({
            url: blobUrl,
            x: currentX * xStep,
            y: currentY * yStep,
            width: xStep,
            height: yStep
          })
        }

        setData(tileArray)
        setLoading(false)
      } catch (error) {
        console.error('Error downloading image:', error);
        setLoading(false)
        throw error;
      }
    }

    load()
  }, [user, getTexture, loadTexture])

  if (isLoading) return <div className="h-full w-full flex justify-center items-center"><p className="text-2xl text-green-500 ">LOADING</p></div>
  if (data.length == 0) return <div className="h-full w-full flex justify-center items-center"><p className="text-2xl text-green-500 ">NO IMAGE DATA</p></div>


  // console.log('rendering stage')
  // console.log('entities', entities)

  return (
    <SidebarProvider>
      <Sidebar />
      <Stage>
        {entities.map((entity) => <Entity key={entity.id} entity={entity} />)}
        {data.map((tile) => <Sprite key={tile.url} texture={tile.url} x={tile.x} y={tile.y} />)}
      </Stage>
    </SidebarProvider>
  )
}
