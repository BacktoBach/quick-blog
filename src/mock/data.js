// src/mock/data.js

// 1. Danh sách bài viết giả lập (dùng cho Trang chủ, Chi tiết, Dashboard)
export const mockPosts = [
  {
    id: "post-1",
    title: "A detailed step-by-step guide to manage your lifestyle",
    slug: "a-detailed-step-by-step-guide-to-manage-your-lifestyle",
    content: "<p>Building a blog with React gives you full control over UI and user experience. In this post, we'll walk through how to set up a modern blog...</p>",
    author: "John Doe",
    authorId: "user-1",
    status: "Published",
    createdAt: "May 10, 2026",
    category: "Lifestyle",
    coverImage: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop"
  },
  {
    id: "post-2",
    title: "How to create an effective startup roadmap or ideas",
    slug: "how-to-create-an-effective-startup-roadmap-or-ideas",
    content: "<p>Creating an effective startup roadmap is crucial for alignment. Maximize returns by minimizing resources in your startup roadmap...</p>",
    author: "Jane Smith",
    authorId: "user-2",
    status: "Published",
    createdAt: "May 9, 2026",
    category: "Startup",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop"
  },
  {
    id: "post-3",
    title: "Learning new technology to boost your career in software",
    slug: "learning-new-technology-to-boost-your-career-in-software",
    content: "<p>The tech landscape changes rapidly. Learning new tech is the best way to boost your career and stay competitive...</p>",
    author: "Admin Pro",
    authorId: "admin-1",
    status: "Draft",
    createdAt: "May 8, 2026",
    category: "Technology",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop"
  }
];

// 2. Danh sách người dùng giả lập (dùng cho trang quản lý của Admin)
export const mockUsers = [
  { id: "user-1", username: "johndoe", email: "john@gmail.com", role: "user" },
  { id: "user-2", username: "janesmith", email: "jane@gmail.com", role: "user" },
  { id: "admin-1", username: "adminpro", email: "admin@gmail.com", role: "admin" }
];