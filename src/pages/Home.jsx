// 1. Sửa 'posts' thành 'mockPosts' cho đúng tên biến của bồ nè
import { mockPosts } from '../mock/data'; 

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* TIÊU ĐỀ TRANG */}
      <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Trending Blogs
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Cập nhật những bài viết công nghệ mới nhất từ Quick Blog.
        </p>
      </div>

      {/* LƯỚI BÀI VIẾT (GRID LAYOUT) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 2. Đổi 'posts.map' thành 'mockPosts.map' */}
        {mockPosts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            {/* THUMBNAIL BÀI VIẾT */}
            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden group">
              {/* 3. Sửa 'post.thumbnail' thành 'post.coverImage' */}
              <img
                src={post.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60"}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* 4. Hiển thị đúng Category từ file mock của bồ luôn */}
              <span className="absolute top-3 left-3 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {post.category}
              </span>
            </div>

            {/* NỘI DUNG CARD */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div className="flex-1">
                {/* NGÀY THÁNG & TÁC GIẢ */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
                  <span>•</span>
                  <time>{post.createdAt}</time>
                </div>

                {/* TIÊU ĐỀ */}
                <h3 className="mt-3 text-lg font-bold leading-snug text-gray-900 line-clamp-2 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 cursor-pointer">
                  {post.title}
                        </h3>

                        {/* MÔ TẢ NGẮN */}
                        {/* 5. Vì content của bồ là dạng HTML, tụi mình dùng dangerouslySetInnerHTML để hiển thị hoặc strip tag. Ở đây để ngắn gọn, mình đưa tạm cái content dạng text qua line-clamp nhé */}
                        <div
                            className="mt-2 text-sm text-gray-600 line-clamp-3 dark:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* NÚT ĐỌC THÊM */}
              <div className="mt-5 border-t border-gray-100 pt-3 dark:border-gray-800">
                <button className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer group">
                  Đọc thêm 
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 ml-1">→</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}