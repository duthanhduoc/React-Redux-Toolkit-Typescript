import BlogList from 'pages/Blog/components/BlogList'
import CreateBlogSection from 'pages/Blog/components/CreateBlogSection'

export default function Blog() {
  return (
    <div className='p-5'>
      <CreateBlogSection />
      <BlogList />
    </div>
  )
}
