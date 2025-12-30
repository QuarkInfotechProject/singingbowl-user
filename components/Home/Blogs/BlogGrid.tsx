"use client";

import { useEffect, useState } from "react";
import SectionTitle from "../SectionTitle";
import BlogCard from "./BlogCard";
import { fetchPosts } from "@/lib/apiItems";
import { BlogPost } from "@/types/blog";

// Blog card skeleton
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

const BlogGrid = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts();
        // API returns { data: { data: [...] } }
        const postsData = response.data?.data || [];
        // Limit to 3 posts for homepage
        setPosts(postsData.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="w-full px-3 md:px-20 mx-auto flex flex-col items-center justify-center text-center mb-8 gap-8">
      <SectionTitle title="Read our Blogs & Articles" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {isLoading ? (
          <>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </>
        ) : posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post.id} post={post} />)
        ) : (
          <p className="col-span-3 text-gray-500">No blog posts available.</p>
        )}
      </div>
    </div>
  );
};

export default BlogGrid;