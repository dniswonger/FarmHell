import { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    sasUrl?: string
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
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
}