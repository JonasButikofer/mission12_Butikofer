import { useEffect, useState } from "react";
import { Book } from "../types/Book";

import Pagination from "../components/Pagination";
import { deleteBook, fetchBooks } from "../api/BooksApi";
import NewBookForm from "../components/NewBookForm";
import EditBookForm from "../components/EditBookForm";

const AdminBooksPage = () => {
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const [books, setBooks] = useState<Book[]>([]);
const [pageSize, setPageSize] = useState<number>(10);
const [pageNum, setPageNum] = useState<number>(1);
const [totalPages, setTotalPages] = useState<number>(0);
const [showForm, setShowForm] = useState(false);
const [editingBook, setEditingBook] = useState<Book | null>(null);
const [sortAlphabetical, setSortAlphabetical] = useState(false);




useEffect(() => {
    const loadBooks = async () => {
        try {
            const data = await fetchBooks(pageSize, pageNum, [], sortAlphabetical);
            setBooks(data.books);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize))
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    
    };

    loadBooks();
}, [pageSize, pageNum, sortAlphabetical]) // this triggers the useEffect to tell it when to go fetch again

const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm('Delete book?');
    if (!confirmDelete) return;

    try {
        await deleteBook(bookId);
        setBooks(books.filter((item) => item.bookId !== bookId));
    
    } catch (error) {
        alert('Failed to delete book');

    } throw error 
};

    if (loading) return <p>Loading books...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>

    return (
        <div>
            <h1>Admin - Books</h1>

            {!showForm && (
                <button className="btn btn-success mb-3"
                onClick={() => setShowForm(true)}>Add Book</button>
            )}

            {showForm && (
            <NewBookForm 
                onSucess={() => {
                    setShowForm(false);
                    fetchBooks(pageSize, pageNum, [], sortAlphabetical).then(data => setBooks(data.books));
                }}
                onCancel={() => setShowForm(false)}
            />
        )}

        {editingBook && (
            <EditBookForm book={editingBook} onSucess={() => {
                setEditingBook(null);
                fetchBooks(pageSize, pageNum, [], sortAlphabetical).then((data) => setBooks(data.books));
            }}
            onCancel={() => setEditingBook(null)}
            />
        )}

            <div className="form-check mb-3">
            <input
                className="form-check-input"
                type="checkbox"
                id="sortAlphabetical"
                checked={sortAlphabetical}
                onChange={() => {
                setSortAlphabetical((prev) => !prev);
                setPageNum(1); // reset to first page when toggling
                }}
            />
            <label className="form-check-label" htmlFor="sortAlphabetical">
                Sort Alphabetically
            </label>
            </div>

            <table className="table table-bordered table-stripped">
                <thead className="table-dark">
                    <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Publisher</th>
                    <th>ISBN</th>
                    <th>Classification</th>
                    <th>Category</th>
                    <th>Page Count</th>
                    <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        books.map((item) => (
                            <tr key={item.bookId}>
                                <td>{item.title}</td>
                                <td>{item.author}</td>
                                <td>{item.publisher}</td>
                                <td>{item.isbn}</td>
                                <td>{item.classification}</td>
                                <td>{item.category}</td>
                                <td>{item.pageCount}</td>
                                <td>{item.price}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm w-100 mb-1" onClick={() => setEditingBook(item)}>Edit</button>
                                    <button className="btn btn-danger btn-sm w-100 mb-1" onClick={() => handleDelete(item.bookId)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <Pagination
            currentPage={pageNum}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPageNum}
            onPageSizeChange={(newSize) => {setPageSize(newSize);
            setPageNum(1);
            }}

            />
            
        </div>
    )
}

export default AdminBooksPage;

