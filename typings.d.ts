export interface PostType {
  _id: string
  _createdAt: string
  title: string
  author: {
    name: string
    image: string
  }
  description: string
  mainImage: {
    asset: {
      url: string
    }
  }
  slug: {
    current: string
  }
  body: [object]
  comments: CommentType[]
}

export interface CommentType {
  comment: string
  name: string
  _id: string
}
