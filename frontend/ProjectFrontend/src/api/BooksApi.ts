import { Book } from "../types/Book";

interface fetchBookResponse {
  books: Book[];
  totalNumBooks: number;
}

const API_URL = 'https://mission13-butikofer.azurewebsites.net/Book';


export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[],
  sortAlphabetical: boolean
): Promise<fetchBookResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortAlphabetical=${sortAlphabetical}${
        selectedCategories.length ? `&${categoryParams}` : ""
      }`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching books", error);
    throw error;
  }
};


export const addBook = async (newBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/AddBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
};

export const updateBook = async (bookId: number, updatedBook: Book) : Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBook),
        });

        return await response.json();

    } catch (error) {
        console.error("Failed to update the book: ", error);
        throw error;
    }
}

export const deleteBook = async (bookId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, 
            {method: 
                'DELETE'
            }
        );
        if (!response.ok) {
            throw new Error('Failed to delete book')
        
        }

    } catch (error) {
        console.error('Error deleting book: ', error);
        throw error;
    }
}