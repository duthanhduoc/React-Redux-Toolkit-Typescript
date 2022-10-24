export default function PostItem() {
  return (
    <div className='flex flex-col items-center overflow-hidden rounded-lg border md:flex-row'>
      <div className='group relative block h-48 w-full shrink-0 self-start overflow-hidden bg-gray-100 md:h-full md:w-32 lg:w-48'>
        <img
          src='https://images.unsplash.com/photo-1656333422687-6830f720c38f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'
          loading='lazy'
          alt='Muốn thành công thì khao khát thành công phải lớn hơn nỗi sợ bị thất bại.'
          className='absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110'
        />
      </div>
      <div className='flex flex-col gap-2 p-4 lg:p-6'>
        <span className='text-sm text-gray-400'>2022-10-14T11:33</span>
        <h2 className='text-xl font-bold text-gray-800'>
          Muốn thành công thì khao khát thành công phải lớn hơn nỗi sợ bị thất bại.
        </h2>
        <p className='text-gray-500'>
          Bạn chớ nên bỏ cuộc khi bạn vẫn còn điều gì đó để cho đi. Không có gì là hoàn toàn bế tắc, sự việc chỉ thật sự
          trở nên bế tắc khi bạn thôi không cố gắng nữa.
        </p>
        <div>
          <div className='inline-flex rounded-md shadow-sm' role='group'>
            <button
              type='button'
              className='rounded-l-lg border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700'
            >
              Edit
            </button>
            <button
              type='button'
              className='rounded-r-lg border-t border-b border-r border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700'
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
