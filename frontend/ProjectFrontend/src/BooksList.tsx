import { useState, useEffect } from "react";
import { Book } from './types/Book';
import 'bootstrap/dist/css/bootstrap.min.css';

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortAlphabetical, setSortAlphabetical] = useState<boolean>(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                console.log("Fetching books from API...");
                const response = await fetch(`https://localhost:5000/api/Book?pageSize=${pageSize}&pageNum=${pageNum}&sortAlphabetical=${sortAlphabetical}`);

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
    }, [pageSize, pageNum, sortAlphabetical]);

    return (
        <div className="container mt-4">
            <h1 className="text-center">Book List</h1>
            <br />

            {/* Page size dropdown */}
            <div className="mb-3">
                <label className="form-label">Results per page:</label>
                <select
                    className="form-select w-auto"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>

            {/* Alphabetical Sorting Toggle */}
            <button
                onClick={() => setSortAlphabetical((prev) => !prev)}
                className={`btn ${sortAlphabetical ? 'btn-secondary' : 'btn-primary'}`}
            >
                {sortAlphabetical ? "Disable Alphabetical Sort" : "Enable Alphabetical Sort"}
            </button>

            {loading && <p className="text-primary">Loading books...</p>}
            {error && <p className="text-danger">{error}</p>}

            {books.length > 0 ? (
                <>
                    {books.map((book) => (
                        <div key={book.bookId} className="card mb-3 p-3">
                            <h3 className="card-title">{book.title}</h3>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Author:</strong> {book.author}</li>
                                <li className="list-group-item"><strong>Publisher:</strong> {book.publisher}</li>
                                <li className="list-group-item"><strong>ISBN:</strong> {book.isbn}</li>
                                <li className="list-group-item"><strong>Classification:</strong> {book.classification}</li>
                                <li className="list-group-item"><strong>Category:</strong> {book.category}</li>
                                <li className="list-group-item"><strong>Page Count:</strong> {book.pageCount}</li>
                                <li className="list-group-item"><strong>Price:</strong> ${book.price.toFixed(2)}</li>
                            </ul>
                        </div>
                    ))}

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-center mt-3">
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