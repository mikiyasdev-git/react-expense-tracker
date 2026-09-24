import ExpenseItem from "./ExpenseItem";
import { useExpenses } from "../context/ExpensesContext";

function ExpenseList() {
  const { expenses } = useExpenses();
  if (expenses.length === 0) {
    return <p className="empty-message">No expenses yet. Add your first one!</p>
  }
  return (
    <ul className="expense-list">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          id={expense.id}
        />
      ))}
    </ul>
  );
}

export default ExpenseList;