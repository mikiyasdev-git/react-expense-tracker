import { useEffect, useState } from "react";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactionApi";

import { getAccounts } from "../api/accountApi";
import { getCategories } from "../api/categoryApi";

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    account_id: "",
    category_id: "",
    type: "expense",
    amount: "",
    description: "",
    transaction_date: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      setError("");

      const [
        transactionsResponse,
        accountsResponse,
        categoriesResponse,
      ] = await Promise.all([
        getTransactions(),
        getAccounts(),
        getCategories(),
      ]);

      setTransactions(transactionsResponse.data);
      setAccounts(accountsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load transaction data."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      // When transaction type changes,
      // reset the selected category.
      if (name === "type") {
        updated.category_id = "";
      }

      return updated;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError("");

      const payload = {
        ...form,
        account_id: Number(form.account_id),
        category_id: Number(form.category_id),
        amount: Number(form.amount),
      };

      if (editingId) {
        const response = await updateTransaction(
          editingId,
          payload
        );

        setTransactions((previous) =>
          previous.map((transaction) =>
            transaction.id === editingId
              ? response.data
              : transaction
          )
        );
      } else {
        const response = await createTransaction(payload);

        setTransactions((previous) => [
          ...previous,
          response.data,
        ]);
      }

      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save transaction."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(transaction) {
    setEditingId(transaction.id);

    setForm({
      account_id: String(transaction.account_id),
      category_id: String(transaction.category_id),
      type: transaction.type,
      amount: String(transaction.amount),
      description: transaction.description || "",
      transaction_date: transaction.transaction_date
        ? transaction.transaction_date.slice(0, 10)
        : "",
    });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTransaction(id);

      setTransactions((previous) =>
        previous.filter(
          (transaction) => transaction.id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete transaction."
      );
    }
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      account_id: "",
      category_id: "",
      type: "expense",
      amount: "",
      description: "",
      transaction_date: "",
    });
  }

  function getAccountName(accountId) {
    const account = accounts.find(
      (item) => item.id === accountId
    );

    return account?.name || "Unknown account";
  }

  function getCategoryName(categoryId) {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category?.name || "Unknown category";
  }

  if (isLoading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <section>
      <h2>Transactions</h2>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Account */}
        <select
          name="account_id"
          value={form.account_id}
          onChange={handleChange}
          required
        >
          <option value="">Select account</option>

          {accounts.map((account) => (
            <option
              key={account.id}
              value={account.id}
            >
              {account.name}
            </option>
          ))}
        </select>

        {/* Transaction Type */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        {/* Category */}
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>

          {categories
            .filter(
              (category) => category.type === form.type
            )
            .map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
        </select>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        {/* Date */}
        <input
          type="date"
          name="transaction_date"
          value={form.transaction_date}
          onChange={handleChange}
          required
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : editingId
              ? "Update Transaction"
              : "Add Transaction"}
        </button>

        {/* Cancel */}
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div>
          {transactions.map((transaction) => (
            <div key={transaction.id}>
              <h3>
                {transaction.type === "income"
                  ? "+"
                  : "-"}{" "}
                {Number(transaction.amount).toLocaleString()} ETB
              </h3>

              <p>
                Account:{" "}
                {getAccountName(transaction.account_id)}
              </p>

              <p>
                Category:{" "}
                {getCategoryName(transaction.category_id)}
              </p>

              <p>
                Type: {transaction.type}
              </p>

              <p>
                Description:{" "}
                {transaction.description || "-"}
              </p>

              <p>
                Date:{" "}
                {transaction.transaction_date
                  ? new Date(
                      transaction.transaction_date
                    ).toLocaleDateString()
                  : "-"}
              </p>

              <button
                type="button"
                onClick={() => handleEdit(transaction)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(transaction.id)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Transaction;