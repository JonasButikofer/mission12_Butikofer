import BooksList from "../components/BooksList";
import CategoryFilterReal from "../components/CategoryFilterReal";
import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
// import CartSummary from "../components/CartSummary";

function BooksPage () {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  console.log("📘 BooksPage rendered");
  console.log("📂 selectedCategories (state):", selectedCategories);

  useEffect(() => {
    console.log("🧠 useEffect in BooksPage ran");
  }, []);

  return (
    <>
    <PageHeader />
      <div className="container my-4">
        {/* <CartSummary /> */}
        <div className="row">
          {/* Sidebar - 1/3 width */}
          <div className="col-md-4 col-lg-4 mb-4">
            <CategoryFilterReal
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>

          {/* Main content - 2/3 width */}
          <div className="col-md-8 col-lg-8">
            <BooksList selectedCategories={selectedCategories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default BooksPage;
