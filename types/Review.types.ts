export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  content: string;
  isOwnerReply?: boolean;
}

export interface ReviewsAndRatingProps {
  productName?: string;
  reviews?: Review[];
  onReviewSubmit?: (data: ReviewFormData) => void;
}

export interface ReviewFormData {
  rating: number;
  content: string;
  author?: string;
}
