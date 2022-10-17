import { addPost, cancelEditPost, updatePost } from 'pages/Blog/blog.slice'
import { FormEvent, Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'store/store'
import { PostType } from 'types/blog.type'

const initalBlog = {
  description: '',
  featuredImage: '',
  publishDate: '',
  published: false,
  title: ''
}

interface ErrorForm {
  publishDate: string
}

export default function CreateBlogSection() {
  const [post, setBlog] = useState<Omit<PostType, 'id'>>(initalBlog)
  const [errorForm, setErrorForm] = useState<null | ErrorForm>(null)
  const editingPost = useSelector((state: RootState) => state.post.editingPost)
  const dispatch = useAppDispatch()
  useEffect(() => {
    setBlog(editingPost || initalBlog)
  }, [editingPost])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingPost) {
      dispatch(
        updatePost({
          postId: editingPost.id,
          body: post
        })
      )
        .unwrap()
        .then(() => handleReset())
        .catch((error) => {
          console.log(error)
          setErrorForm(error.error)
        })
    } else {
      dispatch(addPost(post))
        .unwrap()
        .then(() => handleReset())
    }
  }

  const handleReset = () => {
    dispatch(cancelEditPost())
  }

  return (
    <div>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className='mb-6'>
          <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 '>
            Title
          </label>
          <input
            type='text'
            id='title'
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Title'
            value={post.title}
            onChange={(event) => setBlog((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
        </div>
        <div className='mb-6'>
          <label htmlFor='featuredImage' className='mb-2 block text-sm font-medium text-gray-900 '>
            Featured Image
          </label>
          <input
            type='text'
            id='featuredImage'
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Url image'
            value={post.featuredImage}
            onChange={(event) => setBlog((prev) => ({ ...prev, featuredImage: event.target.value }))}
            required
          />
        </div>
        <div className='mb-6'>
          <div>
            <label htmlFor='description' className='mb-2 block text-sm font-medium text-gray-900 '>
              Description
            </label>
            <textarea
              id='description'
              rows={3}
              className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
              placeholder='Your description...'
              value={post.description}
              onChange={(event) => setBlog((prev) => ({ ...prev, description: event.target.value }))}
              required
            />
          </div>
        </div>
        <div className='mb-6'>
          <label
            htmlFor='publishDate'
            className={`mb-2 block text-sm font-medium   ${errorForm?.publishDate ? 'text-red-700' : 'text-gray-900'}`}
          >
            Publish Date
          </label>
          <input
            type='datetime-local'
            id='publishDate'
            className={`block w-56 rounded-lg border p-2.5 text-sm focus:outline-none  ${
              errorForm?.publishDate
                ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 bg-gray-50  text-gray-900 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder='Title'
            value={post.publishDate}
            onChange={(event) => setBlog((prev) => ({ ...prev, publishDate: event.target.value }))}
            required
          />
          {errorForm?.publishDate && (
            <p className='mt-2 text-sm text-red-600 '>
              <span className='font-medium'>Lỗi! </span>
              {errorForm.publishDate}
            </p>
          )}
        </div>
        <div className='mb-6 flex items-center'>
          <input
            id='publish'
            type='checkbox'
            className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
            checked={post.published}
            onChange={(event) => setBlog((prev) => ({ ...prev, published: event.target.checked }))}
          />
          <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900 '>
            Publish
          </label>
        </div>
        <div>
          {editingPost && (
            <Fragment>
              <div>
                <button
                  type='submit'
                  className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 '
                >
                  <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 '>
                    Update Post
                  </span>
                </button>
                <button
                  type='reset'
                  className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 '
                >
                  <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 '>
                    Cancel
                  </span>
                </button>
              </div>
            </Fragment>
          )}
          {!editingPost && (
            <button
              className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 '
              type='submit'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0'>
                Publish Post
              </span>
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
