import { useState, useEffect, SetStateAction } from "react";
import { Book } from "../types/Book";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BooksList.css";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

function BookList({ selectedCategories = [] }: { selectedCategories?: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortAlphabetical, setSortAlphabetical] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
  }, [selectedCategories]);

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `category=${encodeURIComponent(cat)}`)
        .join("&");

      try {
        console.log("Fetching books from API...");
        const response = await fetch(
          `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortAlphabetical=${sortAlphabetical}${
            selectedCategories.length ? `&${categoryParams}` : ""
          }`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data && data.books) {
          setBooks(data.books);
          setTotalItems(data.totalNumBooks || 0);
          setTotalPages(Math.ceil((data.totalNumBooks || 0) / pageSize));
        } else {
          console.error("Unexpected API structure:", data);
          setBooks([]);
        }
      } catch (error) {
        setError("Error fetching books. Please check your backend.");
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pageSize, pageNum, sortAlphabetical, JSON.stringify(selectedCategories)]);

  return (
    <div className="book-list-container">
      {loading && <p className="text-primary">Loading books...</p>}
      {error && <p className="text-danger">{error}</p>}

      {books.length > 0 ? (
        <>
          {books.map((book) => (
            <div key={book.bookId} className="book-card">
              <h4 className="book-title">{book.title}</h4>
              <ul className="book-details">
                <li><strong>Author:</strong> {book.author}</li>
                <li><strong>Publisher:</strong> {book.publisher}</li>
                <li><strong>ISBN:</strong> {book.isbn}</li>
                <li><strong>Classification:</strong> {book.classification}</li>
                <li><strong>Category:</strong> {book.category}</li>
                <li><strong>Page Count:</strong> {book.pageCount}</li>
                <li><strong>Price:</strong> <span className="text-success">${book.price.toFixed(2)}</span></li>
              </ul>
              <button
                className='btn btn-success'
                onClick={() =>
                    navigate(`/purchase/${book.title}/${book.bookId}`, {
                    state: { price: book.price }})}>Buy</button>
            </div>
          ))}
                    <Pagination 
                        currentPage={pageNum}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={setPageNum}
                        onPageSizeChange={(newSize: SetStateAction<number>) => {
                            setPageSize(newSize);
                            setPageNum(1);
                        }}
                        />


            {/* Alphabetical Sorting Toggle */}
                <button
            onClick={() => setSortAlphabetical((prev) => !prev)}
            className={`btn ${sortAlphabetical ? "btn-secondary" : "btn-primary"} mb-3`}
        >
            {sortAlphabetical ? "Disable Alphabetical Sort" : "Enable Alphabetical Sort"}
        </button>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setPageNum((prev) => Math.max(prev - 1, 1))}
              disabled={pageNum === 1}
            >
              Previous
            </button>
            <span className="align-self-center">Page {pageNum} of {totalPages > 0 ? totalPages : 1}</span>
            <button
              className="btn btn-outline-primary ms-2"
              onClick={() => setPageNum((prev) => (totalPages > 0 ? Math.min(prev + 1, totalPages) : prev))}
              disabled={pageNum >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-muted">No books found.</p>
      )}
    </div>
  );
}

export default BookList;
