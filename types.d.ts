export interface UserProps {
    id: number,
    firstName: string,
    lastName: string,
    profilePicture?: string,
    coverPicture?: string,
    gender: string,
    email: string,
    bio?: string,
    addressFrom?: string,
    createdAt: string,
    updatedAt?: string,
    disabledAt?: string,
    areFriends?: boolean
}

export interface PostProps {
    id: number,
    featureImage?: string,
    description: string,
    shares: number
    author: UserProps,
    likes: LikeProps[],
    comments: CommentProps[],
    createdAt: string,
    updatedAt?: string
}

export interface LikeProps {
    id: number,
    userId: number,
    post: PostProps,
    postId: number,
    user: UserProps,
    createdAt: string,
    updatedAt?: string
}

export interface CommentProps {
    postId: number,
    comment: string,
    author: UserProps,
    post: PostProps,
    replies: CommentProps[],
    createdAt: string,
    updatedAt?: string
}