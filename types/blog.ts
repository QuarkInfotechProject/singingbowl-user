// Blog post in list response
export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    description: string;
    createdAt: string;
    files: {
        zone: "desktopImage" | "mobileImage";
        imageUrl: string;
    }[];
}

// Blog post detail response
export interface BlogDetail {
    title: string;
    readTime: number;
    description: string;
    createdAt: string;
    files: {
        desktop: {
            id: number;
            desktopUrl: string;
        } | null;
        mobile: {
            id: number;
            mobileUrl: string;
        } | null;
    };
    meta: {
        metaTitle: string;
        keywords: string[];
        metaDescription: string;
    };
    navigation: {
        previous: {
            title: string;
            slug: string;
        } | null;
        next: {
            title: string;
            slug: string;
        } | null;
    };
}

// Pagination response wrapper
export interface BlogListResponse {
    current_page: number;
    data: BlogPost[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
