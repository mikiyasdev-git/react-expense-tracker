import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { ExpensesProvider } from "../context/ExpensesContext";

function Expenses ({
  expenses,
  searchText,
  onSearchChange,
  onClearSearch,
  onAdd,
  onDelete,
  onSortByAmount,
})  { 
  return (
    <div>
      <ExpenseForm onAdd={onAdd} />
      <input 
        type="text"
        className="search-input"
        placeholder="Search expenses..."
        value={searchText}
        onChange={(event) => onSearchChange (event.target.value)}
        onKeyDown={ (event) => {
          if (event.key === "Escape") {
            onClearSearch();
          }
        }}
        />
        <button className="sort-button" onClick={onSortByAmount}>
          Sort by amount
        </button>
        <ExpensesProvider expenses={expenses} onDelete={onDelete}>
          <ExpenseList />
        </ExpensesProvider>
    </div>
  );
}

export default Expenses;