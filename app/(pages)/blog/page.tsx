"use client";

import BlogCard from '@/components/Home/Blogs/BlogCard';
import { fetchPosts } from '@/lib/apiItems';
import { BlogPost } from '@/types/blog';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

// Blog card skeleton for list page
const BlogCardSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
    <div className="w-full h-48 md:h-56 bg-gray-200" />
    <div className="flex flex-col gap-3 p-4">
      <div className="h-5 bg-gray-200 rounded w-full" />
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-24 mt-2" />
    </div>
  </div>
);

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPosts(currentPage);
        const data = response.data;
        setPosts(data?.data || []);
        setTotalPages(data?.last_page || 1);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [currentPage]);

  // Filter posts by search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-gradient-to-b from-white via-blue-50/30 to-white min-h-screen">
      <div className="flex flex-col gap-8 w-full px-4 md:px-16 lg:px-20 pt-12 pb-16">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="font-bold text-3xl md:text-4xl text-gray-900">Blog & Insights</h1>
          <p className="text-gray-600 text-lg">Explore articles on Singing Bowls.</p>
        </div>

        {/* Search and Filter Section */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <BlogCard key={post.id} post={post} />)
          ) : (
            <p className="col-span-3 text-gray-500 text-center py-8">
              {searchTerm ? "No posts match your search." : "No blog posts available."}
            </p>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;