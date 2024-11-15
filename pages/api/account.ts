import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, User } from '@prisma/client'

export type AccountInfo = {
    user: User
};

type ResponseData = {
    accountInfo?: AccountInfo
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const prisma = new PrismaClient()

    if (req.method == 'POST') {

        console.log("POST")
        console.log(req.body)

        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                oauthid: req.body.oauthid
            }
        })

        res.status(200).json({ accountInfo: { user } })
    } else {
        console.log('getting users!!!!')
        try {
            const user = await prisma.user.findUnique({
                where: {
                    oauthid: req.query.userId as string
                }
            })

            if (user) {
                res.status(200).json({ accountInfo: { user } })
            }
            else {
                res.status(404).json({ error: 'User not found' })
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user: ' + error });
        }
    }
}





