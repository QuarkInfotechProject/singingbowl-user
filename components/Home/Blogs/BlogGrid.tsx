import SectionTitle from "../SectionTitle";
import BlogCard from "./BlogCard"

const BlogGrid = () => {
  return (
    <div className="w-full px-3 md:px-26 mx-auto flex flex-col items-center justify-center text-center mb-20 gap-12">
      <SectionTitle title="Read our Blogs & Articles" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <BlogCard />
        <BlogCard />
        <BlogCard />
      </div>
    </div>
  );
}
export default BlogGrid