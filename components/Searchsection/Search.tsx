"use client";

import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Search = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Search:", searchQuery);
  };

  return (
    <>
      {/* Desktop Search Bar */}
      <div className="hidden md:flex items-center border border-gray-300 rounded-xl overflow-hidden w-full max-w-3xl">
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow px-4 py-2 outline-none text-gray-700"
        />
        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-4 py-3 flex items-center justify-center"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Search Bar - Click anywhere opens dialog */}
      <div
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center border border-gray-300 rounded-xl overflow-visible w-[80px] flex-1 cursor-pointer"
      >
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow px-3 py-2 outline-none text-gray-700 text-sm pointer-events-none w-full"
          readOnly
        />
        <div className="bg-black text-white px-3 py-2 flex items-center justify-center flex-shrink-0 rounded-r-xl">
          <SearchIcon className="text-white" style={{ fontSize: "20px" }} />
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] rounded-xl mt-0 top-0 translate-y-0">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-700"
              autoFocus
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center"
            >
              <SearchIcon className="text-white" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Search;
