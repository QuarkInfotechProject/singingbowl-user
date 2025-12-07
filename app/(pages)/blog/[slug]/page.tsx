"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchPostBySlug } from "@/lib/apiItems";
import { BlogDetail } from "@/types/blog";
import { Calendar, Clock, ChevronLeft, ChevronRight, List } from "lucide-react";

// Table of contents item
interface TOCItem {
    id: string;
    text: string;
    level: number;
}

// Blog detail skeleton
const BlogDetailSkeleton = () => (
    <div className="w-full animate-pulse">
        {/* Hero skeleton */}
        <div className="w-full h-64 md:h-96 bg-gray-200" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Title skeleton */}
            <div className="mb-8">
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
            </div>

            <div className="flex gap-8">
                {/* TOC skeleton */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-32" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="flex-1 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
            </div>
        </div>
    </div>
);

const BlogDetailPage = () => {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<BlogDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const contentRef = useRef<HTMLDivElement>(null);

    // Fetch post data
    useEffect(() => {
        const loadPost = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const response = await fetchPostBySlug(slug);
                setPost(response.data || null);
            } catch (err) {
                console.error("Failed to load post:", err);
                setError("Failed to load blog post.");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    // Extract headings from content and build TOC
    useEffect(() => {
        if (!post?.description) return;

        // Parse description for h1, h2, h3 tags
        const parser = new DOMParser();
        const doc = parser.parseFromString(post.description, "text/html");
        const headings = doc.querySelectorAll("h1, h2, h3");

        const items: TOCItem[] = [];
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            const text = heading.textContent || "";
            const level = parseInt(heading.tagName.charAt(1));
            items.push({ id, text, level });
        });

        setTocItems(items);
        if (items.length > 0) {
            setActiveId(items[0].id);
        }
    }, [post?.description]);

    // Track scroll position for active TOC item
    const handleScroll = useCallback(() => {
        if (!contentRef.current || tocItems.length === 0) return;

        const headings = contentRef.current.querySelectorAll("h1, h2, h3");
        let currentActive = tocItems[0]?.id || "";

        headings.forEach((heading, index) => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 150) {
                currentActive = `heading-${index}`;
            }
        });

        setActiveId(currentActive);
    }, [tocItems]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Scroll to heading
    const scrollToHeading = (id: string) => {
        const index = parseInt(id.split("-")[1]);
        const headings = contentRef.current?.querySelectorAll("h1, h2, h3");
        if (headings && headings[index]) {
            headings[index].scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Render description with IDs on headings
    const renderContent = () => {
        if (!post?.description) return null;

        // Add IDs to headings for scroll targeting
        let headingIndex = 0;
        const contentWithIds = post.description.replace(
            /<(h[1-3])([^>]*)>([^<]*)<\/h[1-3]>/gi,
            (match, tag, attrs, text) => {
                const id = `heading-${headingIndex}`;
                headingIndex++;
                return `<${tag}${attrs} id="${id}" class="scroll-mt-24">${text}</${tag}>`;
            }
        );

        return (
            <div
                ref={contentRef}
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />
        );
    };

    if (loading) {
        return <BlogDetailSkeleton />;
    }

    if (error || !post) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error || "Blog post not found."}</p>
            </div>
        );
    }

    const heroImage = post.files?.desktop?.desktopUrl || post.files?.mobile?.mobileUrl || "/assets/images/home/why/history.png";

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="container mx-auto px-4 md:px-20 py-8">
                {/* Title and Meta at Top */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.createdAt}
                        </span>
                        {post.readTime && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readTime} min read
                            </span>
                        )}
                    </div>
                </div>

                {/* Hero Image */}
                <div className="w-full h-64 md:h-96 relative rounded-lg overflow-hidden mb-8">
                    <Image
                        src={heroImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Main Content with TOC */}
                <div className="flex gap-8 mt-8">
                    {/* Sticky Table of Contents - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                                <List className="w-5 h-5" />
                                Table of Contents
                            </div>
                            {tocItems.length > 0 ? (
                                <nav className="space-y-2 border-l-2 border-gray-200 pl-4">
                                    {tocItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToHeading(item.id)}
                                            className={`block text-left text-sm transition-colors w-full ${activeId === item.id
                                                ? "text-[#A12717] font-medium border-l-2 border-[#A12717] -ml-[18px] pl-4"
                                                : "text-gray-600 hover:text-[#A12717]"
                                                } ${item.level === 2 ? "pl-2" : ""} ${item.level === 3 ? "pl-4" : ""}`}
                                        >
                                            {item.text}
                                        </button>
                                    ))}
                                </nav>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No headings found in this article.</p>
                            )}
                        </div>
                    </aside>

                    {/* Content */}
                    <article className="flex-1 min-w-0">
                        {renderContent()}
                    </article>
                </div>

                {/* Navigation to Previous/Next */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-12 pt-8 border-t border-gray-200">
                    {post.navigation?.previous ? (
                        <Link
                            href={`/blog/${post.navigation.previous.slug}`}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#A12717] transition-colors group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <div className="text-left">
                                <span className="text-xs text-gray-400 block">Previous</span>
                                <span className="text-sm font-medium line-clamp-1">{post.navigation.previous.title}</span>
                            </div>
                        </Link>
                    ) : (
                        <div />
                    )}
                    {post.navigation?.next ? (
                        <Link
                            href={`/blog/${post.navigation.next.slug}`}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#A12717] transition-colors group text-right"
                        >
                            <div>
                                <span className="text-xs text-gray-400 block">Next</span>
                                <span className="text-sm font-medium line-clamp-1">{post.navigation.next.title}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
