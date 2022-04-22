// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'
import { config } from '../../sanity'

const client = sanityClient({ ...config, token: process.env.SANITY_API_TOKEN })

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body)

  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    })
  } catch (e) {
    return res.status(500).json({ message: `Couldnt submit message: ${e}` })
  }

  res.status(200).json({ message: 'Comment submitted' })
}
