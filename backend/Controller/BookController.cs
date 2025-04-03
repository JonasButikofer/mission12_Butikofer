using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11.Models;

namespace Mission11.NewFolder
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private readonly BookDbContext _bookContext;

        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        [HttpGet("AllBooks")]
        public IActionResult GetBook(
    int pageSize = 5,
    int pageNum = 1,
    bool sortAlphabetical = false,
    [FromQuery] List<string>? category = null)
        {
            var query = _bookContext.Books.AsQueryable();

            if (category != null && category.Any())
            {
                query = query.Where(b => category.Contains(b.Category));
            }

            if (sortAlphabetical)
            {
                query = query.OrderBy(b => b.Title);
            }

            var totalNumBooks = query.Count(); 

            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var response = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };

            return Ok(response);
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()

        {
            var bookCategories = _bookContext.Books
            .Select(p => p.Category)
            .Distinct()
            .ToList();

            return Ok(bookCategories);
        }


                [HttpPost("AddBook")]

        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.Isbn = updatedBook.Isbn;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;


            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }
        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new {message = "Book not found"});

            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }

    }
}