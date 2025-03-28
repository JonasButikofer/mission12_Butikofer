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

            // ✅ Filter by category if any are selected
            if (category != null && category.Any())
            {
                query = query.Where(b => category.Contains(b.Category));
            }

            if (sortAlphabetical)
            {
                query = query.OrderBy(b => b.Title);
            }

            var totalNumBooks = query.Count(); // ✅ Count after filtering

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

    }
}