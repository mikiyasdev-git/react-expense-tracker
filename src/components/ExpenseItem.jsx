import { useExpenses } from "../context/ExpensesContext";

const HIGH_AMOUNT = 600;

function ExpenseItem({ id }) {
  const { expenses, onDelete } = useExpenses();

  // Find the expense that matches this item's ID
  const expense = expenses.find((item) => item.id === id);

  // Handle the case where the expense doesn't exist
  if (!expense) {
    return null;
  }

  // Determine whether the expense is high
  const isHigh = Number(expense.amount) > HIGH_AMOUNT;

  // Determine whether the expense is recurring
  const isRecurring = expense.isRecurring;

  // Handle deleting the expense
  function handleDeleteClick() {
    onDelete(id);
  }

  return (
    <li
      className={
        isHigh ? "expense-item expense-item-high" : "expense-item"
      }
    >
      <span>{expense.title}</span>

      <span className="expense-category">
        {expense.category}
      </span>

      {isHigh && (
        <span className="expense-flag">
          High
        </span>
      )}

      {isRecurring && (
        <span className="expense-recurring">
          Monthly
        </span>
      )}

      <span className="expense-amount">
        {expense.amount} ETB
      </span>

      <button
        className="expense-delete"
        onClick={handleDeleteClick}
      >
        Delete
      </button>
    </li>
  );
}

export default ExpenseItem;