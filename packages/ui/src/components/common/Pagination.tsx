"use client";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function Pagination({
  page,
  setPage,
  totalPages,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center space-x-3 py-8">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-jacarta-100 bg-white text-sm font-semibold dark:border-jacarta-600 dark:bg-jacarta-700 disabled:opacity-50"
      >
        <span className="sr-only">Previous</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="h-4 w-4 fill-jacarta-700 dark:fill-white"
        >
          <g transform="scale(-1,1) translate(-24,0)">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
          </g>
        </svg>
      </button>

      <div className="flex items-center justify-center space-x-1">
        {[...Array(Math.max(totalPages, 1))].map((_, i) => {
          const pageNum = i + 1;

          // Always show first page, current page, and last page
          // Show up to 5 pages before and after current page
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            pageNum === page ||
            (pageNum >= page - 5 && pageNum <= page + 5)
          ) {
            return (
              <button
                key={i}
                onClick={() => setPage(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded text-sm font-semibold
          ${
            page === pageNum
              ? "bg-accent text-white"
              : "border border-jacarta-100 bg-white dark:border-jacarta-600 dark:bg-jacarta-700"
          }`}
              >
                {pageNum}
              </button>
            );
          }

          // Show ellipsis for gaps in page numbers
          if (
            (pageNum === page - 6 && pageNum > 1) ||
            (pageNum === page + 6 && pageNum < totalPages)
          ) {
            return (
              <span key={i} className="px-1">
                ...
              </span>
            );
          }

          return null;
        })}
      </div>

      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-jacarta-100 bg-white text-sm font-semibold dark:border-jacarta-600 dark:bg-jacarta-700 disabled:opacity-50"
      >
        <span className="sr-only">Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="h-4 w-4 fill-jacarta-700 dark:fill-white"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
        </svg>
      </button>
    </div>
  );
}
