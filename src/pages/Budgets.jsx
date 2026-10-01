import { useEffect, useState } from "react";

import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../api/budgetApi";

import { getCategories } from "../api/categoryApi";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    category_id: "",
    amount: "",
    month: "",
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

      const [budgetsResponse, categoriesResponse] =
        await Promise.all([
          getBudgets(),
          getCategories(),
        ]);

      setBudgets(budgetsResponse.data);

      const expenseCategories =
        categoriesResponse.data.filter(
          (category) => category.type === "expense"
        );

      setCategories(expenseCategories);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load budgets."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError("");

      const payload = {
        category_id: Number(form.category_id),
        amount: Number(form.amount),
        month: form.month,
      };

      if (editingId) {
        const response = await updateBudget(
          editingId,
          payload
        );

        setBudgets((previous) =>
          previous.map((budget) =>
            budget.id === editingId
              ? response.data
              : budget
          )
        );
      } else {
        const response = await createBudget(payload);

        setBudgets((previous) => [
          ...previous,
          response.data,
        ]);
      }

      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save budget."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(budget) {
    setEditingId(budget.id);

    setForm({
      category_id: String(budget.category_id),
      amount: String(budget.amount),
      month: budget.month,
    });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBudget(id);

      setBudgets((previous) =>
        previous.filter((budget) => budget.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete budget."
      );
    }
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      category_id: "",
      amount: "",
      month: "",
    });
  }

  function getCategoryName(categoryId) {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category?.name || "Unknown category";
  }

  if (isLoading) {
    return <p>Loading budgets...</p>;
  }

  return (
    <section>
      <h2>Budgets</h2>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">
            Select expense category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Budget amount"
          value={form.amount}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />

        <input
          type="month"
          name="month"
          value={form.month}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : editingId
              ? "Update Budget"
              : "Add Budget"}
        </button>

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

      {budgets.length === 0 ? (
        <p>No budgets found.</p>
      ) : (
        <div>
          {budgets.map((budget) => (
            <div key={budget.id}>
              <h3>
                {getCategoryName(budget.category_id)}
              </h3>

              <p>
                Budget:{" "}
                {Number(budget.amount).toLocaleString()} ETB
              </p>

              <p>
                Month: {budget.month}
              </p>

              <button
                type="button"
                onClick={() => handleEdit(budget)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(budget.id)
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

export default Budgets;