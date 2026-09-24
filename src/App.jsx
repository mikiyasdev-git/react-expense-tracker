import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";

const initialExpenses = [
  { id: 1, title: "Lunch", amount: 150, category: "Food" },
  { id: 2, title: "Taxi", amount: 80, category: "Transport" },
  { id: 3, title: "Electricity", amount: 420, category: "Bills" },
  { id: 4, title: "Cinema", amount: 200, category: "Fun" },
];

function App() {

  const [expenses, setExpenses] = useLocalStorage("expenses", initialExpenses);
  const [searchText, setSearchText] = useLocalStorage("searchText", "");

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const alreadyHasData = localStorage.getItem("expenses");
    if (alreadyHasData) {
      return;
    }

    async function loadStarterExpenses() {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=4"
        );
        if (!response.ok) {
          throw new Error("Could not load starter expenses.");
        }
        const posts = await response.json();

        const categories = ["Food", "Transport", "Bills", "Fun"];
        const fetchedExpenses = posts.map((post, index) => ({
          id: post.id,
          title: post.title.slice(0, 20),
          amount: (post.id * 37) % 500 || 50,
          category: categories[index % categories.length],
        }));

        setExpenses(fetchedExpenses);
      } catch (err) {
        setFetchError(err.message);
        setExpenses(initialExpenses);
      } finally {
        setIsLoading(false);
      }
    }

    loadStarterExpenses();
  }, []);

  const filteredExpenses = expenses.filter((expense) =>
    expense.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const expenseCount = filteredExpenses.length;

  const totalsByCategory = filteredExpenses.reduce((totals, expense) => {
    const currentTotal = totals[expense.category] || 0;
    return { ...totals, [expense.category]: currentTotal + expense.amount };
  }, {});

  const categoryEntries = Object.entries(totalsByCategory);

  let topCategory = "-";
  if (categoryEntries.length > 0) {
    const sorted = [...categoryEntries].sort((a, b) => b[1] - a[1]);
    topCategory = sorted[0][0];
  }

  function handleAdd(newExpense) {
    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
  }

  function handleDelete(id) {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  }

  function handleSortByAmount() {
    setExpenses((prevExpenses) =>
      [...prevExpenses].sort((a, b) => b.amount - a.amount)
    );
  }

  return (
    <div className="app">
      <Header appName="Expense Tracker" />
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard 
             total={totalAmount} 
             count={expenseCount} 
             topCategory={topCategory}
             isLoading={isLoading}
             fetchError={fetchError}
           />
          }
        />
        <Route
          path="/expenses"
          element={
            <Expenses
              expenses={filteredExpenses}
              searchText={searchText}
              onSearchChange={setSearchText}
              onClearSearch={() => setSearchText("")}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onSortByAmount={handleSortByAmount}
            />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;