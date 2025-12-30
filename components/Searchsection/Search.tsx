"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { searchProducts } from "@/lib/apiItems";
import Image from "next/image";
import Link from "next/link";
import { Star, X } from "lucide-react";

interface SearchProduct {
  id: string;
  productName: string;
  url: string;
  brandId: number;
  bestSeller: boolean;
  isNew: boolean;
  onSale: boolean;
  soldCount: number;
  inStock: boolean;
  originalPrice: string;
  specialPrice: string;
  priceDifferencePercentage: number;
  reviewCount: number;
  rating: number;
  baseImage: string;
  productOption: any;
}

const Search = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await searchProducts(searchQuery);

        // Handle different response formats
        if (response.success && response.data?.products) {
          setSearchResults(response.data.products);
        } else if (response.data?.products) {
          setSearchResults(response.data.products);
        } else if (response.products) {
          setSearchResults(response.products);
        } else {
          setSearchResults([]);
        }
        setHasSearched(true);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    }, 1000);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHasSearched(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setOpen(false);
      setHasSearched(false);
    }
  };

  const handleProductClick = () => {
    setHasSearched(false);
    setOpen(false);
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const SearchResultCard = ({ product }: { product: SearchProduct }) => {
    const hasDiscount = product.specialPrice && product.specialPrice !== "";
    const displayPrice = hasDiscount ? product.specialPrice : product.originalPrice;

    return (
      <Link
        href={`/products/${product.url}`}
        onClick={handleProductClick}
        className="group flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100"
      >
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={product.baseImage || "/assets/images/product/1.jpg"}
            alt={product.productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.bestSeller && (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded">Best Seller</span>
          )}
        </div>
        <div className="p-3 flex flex-col gap-1">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">
            {product.productName}
          </h4>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">
              {product.rating || 0} ({product.reviewCount || 0})
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-green-600">${displayPrice}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  // Determine if dropdown should show
  const showDropdown = searchQuery.trim().length > 0 && (isSearching || hasSearched);


  return (
    <>
      {/* Desktop Search Bar */}
      <div className="hidden md:block relative w-full max-w-3xl" ref={dropdownRef} style={{ zIndex: 1000 }}>
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-grow px-4 py-2 outline-none text-gray-700"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 py-3 flex items-center justify-center"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Search Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto p-4" style={{ zIndex: 9999 }}>
            {isSearching ? (
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse">
                    <div className="w-full aspect-square bg-gray-200" />
                    <div className="p-3 flex flex-col gap-2">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-4">
                  {searchResults.slice(0, 8).map((product) => (
                    <SearchResultCard key={product.id} product={product} />
                  ))}
                </div>
                {searchResults.length > 8 && (
                  <button
                    onClick={handleSearch}
                    className="w-full p-3 text-center text-sm text-white font-medium bg-[#A12717] hover:bg-[#8A1F0E] rounded-lg transition-colors"
                  >
                    View all {searchResults.length} results
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No products found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Icon - Opens dialog */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="text-black" style={{ fontSize: "24px" }} />
      </button>

      {/* Search Dialog (Mobile) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-h-[90vh] rounded-xl mt-0 top-4 translate-y-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-700"
                  autoFocus
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center"
              >
                <SearchIcon className="text-white" />
              </button>
            </div>

            {/* Mobile Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isSearching ? (
                <div className="grid grid-cols-2 gap-3 p-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse">
                      <div className="w-full aspect-square bg-gray-200" />
                      <div className="p-3 flex flex-col gap-2">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 p-2">
                  {searchResults.map((product) => (
                    <SearchResultCard key={product.id} product={product} />
                  ))}
                </div>
              ) : searchQuery.trim().length > 0 && hasSearched ? (
                <div className="p-4 text-center text-gray-500">
                  No products found for &quot;{searchQuery}&quot;
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Search;
