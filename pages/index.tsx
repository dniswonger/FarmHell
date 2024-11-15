import { useEffect, useState } from "react";
import Stage from "@/components/stage/Stage";
import { Sprite } from "@/components/sprite/Sprite";
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Session } from "next-auth";
import { PrismaClient, Prisma } from "@prisma/client";

type UserWithTileset = Prisma.UserGetPayload<{
  include: { tileset: true }
}>


export const getServerSideProps = (async ({ req, res }) => {

  const session = await getServerSession(
    req,
    res,
    authOptions
  )

  const prisma = new PrismaClient()
  let user: UserWithTileset | null = null

  if (session) {
    user = await prisma.user.findUnique({
      where: {
        oauthid: session.token.sub
      },
      include: {
        tileset: true  // This includes the related tileset in the response
      }
    })

    if (!user) {

      user = await prisma.user.create({
        data: {
          name: session.user?.name,
          email: session.user?.email,
          oauthid: session.token.sub,
          tileset: {
            create: {
              name: "Default",
              tiles: ['Slices_01.jpg', 'Slices_02.jpg', 'Slices_03.jpg', 'Slices_04.jpg', 'Slices_05.jpg', 'Slices_06.jpg', 'Slices_09.jpg'],
              width: 3,
              height: 3
            }
          }
        },
        include: {
          tileset: true
        }
      })
    }
  }
  return { props: { session, user } }
}) satisfies GetServerSideProps<{ session: Session | null, user: UserWithTileset | null }>

export default function Home({ session, user }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [data, setData] = useState<Tile[]>([])
  const [isLoading, setLoading] = useState(true)

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
          const url = URL.createObjectURL(blob);

          const rawNum = blobName.substring(
            blobName.lastIndexOf("_") + 1,
            blobName.lastIndexOf(".")
          );

          const currentX = (parseInt(rawNum) - 1) % gridDimensionX;
          const currentY = Math.floor((parseInt(rawNum) - 1) / gridDimensionY);
          
          tileArray.push({
            url: url,
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
  }, [])

  if (isLoading) return <div className="h-full w-full flex justify-center items-center"><p className="text-2xl text-green-500 ">LOADING</p></div>
  if (data.length == 0) return <div className="h-full w-full flex justify-center items-center"><p className="text-2xl text-green-500 ">NO IMAGE DATA</p></div>

  return (
    <Stage>
      {data.map((tile) => <Sprite key={tile.url} texture={tile.url} x={tile.x} y={tile.y}  />)}
    </Stage>
  )
}
