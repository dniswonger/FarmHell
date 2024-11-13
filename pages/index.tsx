"use client";

import { useEffect, useState } from "react";
import Stage from "@/components/stage/Stage";
import { Sprite } from "@/components/sprite/Sprite";
import { useSession, signIn } from "next-auth/react";
export default function Home() {

  const [data, setData] = useState<string[]>([])
  const [isLoading, setLoading] = useState(true)

  const { data: session } = useSession()

  useEffect(() => {

    async function load() {
      try {

        setLoading(true)

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

        setData(blobArray)
        setLoading(false)
      } catch (error) {
        console.error('Error downloading image:', error);
        setLoading(false)
        throw error;
      }
    }

    load()
  }, [])

  if (!session) return <div><button onClick={() => signIn()}>Sign in</button>not logged in</div>

  if (isLoading) return <div className="h-full w-full flex justify-center items-center"><p className="text-2xl text-green-500 ">LOADING</p></div>
  if (data.length == 0) return <div className="h-full w-full flex justify-center items-center"><p className="text-2xl text-green-500 ">NO IMAGE DATA</p></div>

  return (
    <Stage>
      {data.map((a) => <Sprite key={a} texture={a} />)}
    </Stage>
  )
}
