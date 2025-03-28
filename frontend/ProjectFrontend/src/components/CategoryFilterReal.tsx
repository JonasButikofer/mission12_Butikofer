import { useEffect, useState } from "react";
import "./CategoryFilter.css";


function CategoryFilterReal({selectedCategories, setSelectedCategories}:
    {   selectedCategories: string[];
        setSelectedCategories: (categories: string[]) => void}) {
    const [categories, setCategories] = useState<string[]>([]);




    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await fetch('https://localhost:5000/Book/GetBookCategories');
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            console.log("📦 Categories fetched:", data);
            setCategories(data);
          } catch (error) {
            console.error("Error fetching categories", error);
          }
        };
      
        fetchCategories();
      }, []);
      
    

    function handleCheckBoxChange ({target}: {target: HTMLInputElement})
    {
        const updatedCategories = selectedCategories.includes(target.value) ? selectedCategories.filter(x => x !== target.value) : [...selectedCategories, target.value];

        setSelectedCategories(updatedCategories);
    }

    return (
      <div className="category-filter">
        <h5>Project Types</h5>
        <div className="d-flex flex-column align-items-start">
          {categories.map((c) => (
            <div className="form-check" key={c}>
              <input 
                className="form-check-input"
                type="checkbox"
                id={c}
                value={c}
                onChange={handleCheckBoxChange}
                checked={selectedCategories.includes(c)}
              />
              <label htmlFor={c} className="form-check-label">
                {c}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
    
      
}

export default CategoryFilterReal;




