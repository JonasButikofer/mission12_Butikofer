import BooksList from "../components/BooksList";
import CategoryFilterReal from "../components/CategoryFilterReal";
import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import CartSummary from "../components/CartSummary";
import 'bootstrap/dist/css/bootstrap.min.css';


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
      <div className="container my-5">
        <CartSummary />
        <div className="row">
          {/* Sidebar - 1/3 width */}
          <div className="col-md-5 col-lg-5 mb-5">
            <CategoryFilterReal
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>

          {/* Main content - 2/3 width */}
          <div className="col-md-7 col-lg-7">
            <BooksList selectedCategories={selectedCategories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default BooksPage;
