"use client";

import BlogCard from '@/components/Home/Blogs/BlogCard';
import { Search } from 'lucide-react';
import { useState } from 'react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </div>
      </div>
    </div>
  );
};

export default Blog;