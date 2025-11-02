"use client";

const Search = () => {
  return (
    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden w-full max-w-3xl">
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow px-4 py-2 outline-none text-gray-700"
      />
      <button className="bg-black text-white px-4 py-3 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Search;
