import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
}

// Helper function to strip HTML tags from a string
const stripHtmlTags = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
};

const BlogCard = ({ post }: BlogCardProps) => {
  // Get desktop image URL from files array
  const imageUrl = post.files?.find(f => f.zone === "desktopImage")?.imageUrl || "/assets/images/home/why/history.png";

  // Strip HTML tags and truncate description to ~120 characters
  const plainTextDesc = stripHtmlTags(post.description);
  const truncatedDesc = plainTextDesc.length > 120
    ? plainTextDesc.substring(0, 120) + "..."
    : plainTextDesc;

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="flex flex-col w-full h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="w-full h-48 md:h-56 relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col gap-3 p-4 flex-1">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-[#A12717] transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {truncatedDesc}
          </p>
          <div className="flex items-center gap-4 mt-auto pt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.createdAt}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;