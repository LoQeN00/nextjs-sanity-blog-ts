import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Banner from '../components/Banner'
import { sanityClient } from '../sanity'
import { PostType } from '../typings'
import Post from '../components/Post'

interface Props {
  posts: PostType[]
}

const Home: NextPage<Props> = ({ posts }) => {
  console.log(posts)

  return (
    <div className="">
      <Head>
        <title>Medium 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Banner />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type=="post"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    author -> {
      name,
      image
   },
   description,
   mainImage
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
