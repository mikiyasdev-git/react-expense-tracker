import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

function Categories() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    type: "expense",
  });

  const [editingId, setEditingId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getCategories();

      setCategories(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load categories."
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

      if (editingId) {
        const response = await updateCategory(editingId, form);

        setCategories((previous) =>
          previous.map((category) =>
            category.id === editingId
              ? response.data
              : category
          )
        );
      } else {
        const response = await createCategory(form);

        setCategories((previous) => [
          ...previous,
          response.data,
        ]);
      }

      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save category."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(category) {
    setEditingId(category.id);

    setForm({
      name: category.name,
      type: category.type,
    });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCategory(id);

      setCategories((previous) =>
        previous.filter((category) => category.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete category."
      );
    }
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      name: "",
      type: "expense",
    });
  }

  if (isLoading) {
    return <p>Loading categories...</p>;
  }

  return (
    <section>
      <h2>Categories</h2>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Category name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : editingId
              ? "Update Category"
              : "Add Category"}
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

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div>
          {categories.map((category) => (
            <div key={category.id}>
              <h3>{category.name}</h3>

              <p>
                Type: {category.type}
              </p>

              <button
                type="button"
                onClick={() => handleEdit(category)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(category.id)}
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

export default Categories;