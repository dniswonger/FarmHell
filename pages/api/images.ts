import { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import type { NextApiRequest, NextApiResponse } from 'next'


// export type ImageDef = {
//     name: string;
//     image64: string;
//     x: number;
//     y: number;
// };

type ResponseData = {
    sasUrl?: string
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    // todo: parse request for account info
    // pull list of images from postgres
    // fetch those images from blob storage
    // return images

    // const images: ImageDef[] = []
    // const gridDimensionX = 3;
    // const gridDimensionY = 3;
    // const xStep = 4749;
    // const yStep = 5247;

    // for now just pull the hardcoded images from blob storage



    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
    const containerName = 'images';
    const blobName = req.query.blobName as string;
    
    try {
        // Create credentials
        const sharedKeyCredential = new StorageSharedKeyCredential(
            accountName,
            accountKey
        );

        // Generate SAS token
        const startsOn = new Date();
        const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour from now

        const sasOptions = {
            containerName,
            blobName,
            permissions: BlobSASPermissions.parse('r'), // Read-only permission
            startsOn,
            expiresOn,
        };

        const sasToken = generateBlobSASQueryParameters(
            sasOptions,
            sharedKeyCredential
        ).toString();

        // Generate full URL
        const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${encodeURIComponent(sasToken)}`;

        res.status(200).json({ sasUrl });
    } catch (error) {
        console.error('Error generating SAS URL:', error);
        res.status(500).json({ error: 'Failed to generate SAS URL' });
    }





    // const blobServiceClient = BlobServiceClient.fromConnectionString(
    //     process.env.AZURE_STORAGE_CONNECTION_STRING ?? ""
    // );

    // const client = blobServiceClient.getContainerClient("images");

    // for await (const blob of client.listBlobsFlat()) {
    //     const tempBlockBlobClient = client.getBlockBlobClient(blob.name);

    //     // assume 3 column tiled image that ends in '_X' where X%3 is the column number (1 based)
    //     const rawNum = blob.name.substring(
    //         blob.name.lastIndexOf("_") + 1,
    //         blob.name.lastIndexOf(".")
    //     );

    //     const buf = await tempBlockBlobClient.downloadToBuffer();
    //     const currentX = (parseInt(rawNum) - 1) % gridDimensionX;
    //     const currentY = Math.floor((parseInt(rawNum) - 1) / gridDimensionY);

    //     const base64String = "data:image/png;base64," + buf.toString("base64");

    //     images.push({
    //         name: blob.name,
    //         image64: base64String,
    //         x: currentX * xStep,
    //         y: currentY * yStep,
    //     } satisfies ImageDef);
    // }

    // res.status(200).json({ images })
}