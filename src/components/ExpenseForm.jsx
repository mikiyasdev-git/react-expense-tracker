import { useState } from "react";

    function ExpenseForm({ onAdd }) {
      const [title, setTitle] = useState("");
      const [amount, setAmount] = useState("");
      const [category, setCategory] = useState("Food");
      const [error, setError] = useState("");
      const [isRecurring, setIsRecurring] = useState(false);

      function handleSubmit(event) {
         event.preventDefault();
         if (title.trim() === "") {
          setError("Please enter a title.");
          return;
         }
          if (Number(amount) <= 0 ||  amount.trim() === "") {
            setError("Please enter an amount greater than 0.");

          return;
          }

          setError("");
          const newExpense = {
            id: Date.now(),
            title: title,
            amount: Number(amount),
            category: category,
            isRecurring: isRecurring,
          };
          onAdd(newExpense);
          setTitle("");
          setAmount("");
          setCategory("Food");
          setIsRecurring(false);
          }
 return (
    <form className="expense-form" onSubmit={handleSubmit}>
     <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
     />
    <select value={category} onChange={(event) => setCategory(event.target.value)}>
      <option>Food</option>
      <option>Transport</option>
      <option>Bills</option>
      <option>Fun</option>
      <option>Feed</option>
      <option>Other</option>
    </select>
    <label className="checkbox-label">
      <input type="checkbox" checked={isRecurring} onChange={(event) => setIsRecurring (event.target.checked)} />
      Recurring monthly
    </label>
    <button type="submit">Add</button>
    {error && <p className="form-error"> {error}</p>}
  </form>
    );
}
export default ExpenseForm;