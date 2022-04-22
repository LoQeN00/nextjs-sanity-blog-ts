import React from 'react'
import { PostType } from '../typings'
import { useNextSanityImage } from 'next-sanity-image'
import { sanityClient, urlFor } from '../sanity'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  post: PostType
}

const Post = ({ post }: Props) => {
  return (
    <Link passHref href={`/post/${post.slug.current}`}>
      <div className="group cursor-pointer rounded-lg border shadow-lg">
        <div className="relative h-60 w-full">
          <Image
            src={urlFor(post.mainImage).url()!}
            layout="fill"
            className="transition-transform duration-200 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex items-center justify-between space-x-4 bg-white p-5">
          <div>
            <p className="font-lg font-bold">{post.title}</p>
            <p className="text-sm">
              {post.description} by {post.author.name}
            </p>
          </div>
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={urlFor(post.author.image).url()!}
              layout="fill"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Post
