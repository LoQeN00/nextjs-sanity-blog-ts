import React, { useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Header from '../../components/Header'
import { sanityClient } from '../../sanity'
import { PostType } from '../../typings'
import { urlFor } from '../../sanity'
import Image from 'next/image'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

type Props = {
  post: PostType
}

const PostPage = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false)

  console.log(post)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  return (
    <main>
      <Header />
      <div className="relative h-40">
        <Image
          src={urlFor(post.mainImage).url()!}
          layout="fill"
          className="w-full object-cover"
        />
      </div>
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="my-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image src={urlFor(post.author.image).url()!} layout="fill" />
          </div>
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-5">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            className="space-y-5"
            serializers={{
              h1: (props: any) => (
                <h1 className="font-bold-my-5 text-2xl" {...props}></h1>
              ),
              h2: (props: any) => (
                <h2 className="font-bold-my-5 text-xl" {...props}></h2>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />

      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10 text-white">
          <h3 className="text-3xl font-bold">
            Dziękujemy za zostawienie komentarza!
          </h3>
          <p>Jeżeli zostanie on zatwierdzony, wtedy pojawi się tu na dole</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">
            Podał ci się ten artykuł ?
          </h3>
          <h4 className="text-3xl font-bold">Zostaw komentarz poniżej</h4>
          <hr className="mt-2 py-3" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700">Imie</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Doe"
              type="text"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              placeholder="John Doe"
              type="email"
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Komentarz</span>
            <textarea
              {...register('comment', { required: true })}
              placeholder="John Doe"
              rows={8}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">
                {' '}
                - The Name Field is required
              </span>
            )}

            {errors.email && (
              <span className="text-red-500">
                {' '}
                - The Email Field is required
              </span>
            )}

            {errors.comment && (
              <span className="text-red-500">
                {' '}
                - The Comment Field is required
              </span>
            )}
          </div>

          <input
            type="submit"
            className="cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}

      {post.comments.length && (
        <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
          <h3 className="text-4xl">Comments</h3>
          <hr className="pb-2" />
          {post.comments.map((comment) => (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}</span>:{' '}
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default PostPage

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type=="post"]{
        _id,
        slug {
        current
      }
    }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: PostType) => {
    return {
      params: {
        slug: post.slug.current,
      },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type=="post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        slug,
        author -> {
          name,
          image
       },
       description,
       mainImage,
       body,
       'comments': *[
         _type == "comment" &&
         post._ref == ^._id &&
         approved == true
       ] {
         name,
         comment,
         _id
       }
    }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
