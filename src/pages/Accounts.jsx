import { useEffect, useState } from "react";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../api/accountApi";

function Accounts() {
  const [accounts, setAccounts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    type: "bank",
    currency: "ETB",
  });

  const [editingId, setEditingId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAccounts();

      setAccounts(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load accounts."
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
        const response = await updateAccount(editingId, form);

        setAccounts((previous) =>
          previous.map((account) =>
            account.id === editingId
              ? response.data
              : account
          )
        );
      } else {
        const response = await createAccount(form);

        setAccounts((previous) => [
          ...previous,
          response.data,
        ]);
      }

      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save account."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(account) {
    setEditingId(account.id);

    setForm({
      name: account.name,
      type: account.type,
      currency: account.currency,
    });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteAccount(id);

      setAccounts((previous) =>
        previous.filter((account) => account.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete account."
      );
    }
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      name: "",
      type: "bank",
      currency: "ETB",
    });
  }

  if (isLoading) {
    return <p>Loading accounts...</p>;
  }

  return (
    <section>
      <h2>Accounts</h2>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Account name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="bank">Bank</option>
          <option value="wallet">Wallet</option>
          <option value="cash">Cash</option>
        </select>

        <input
          type="text"
          name="currency"
          value={form.currency}
          onChange={handleChange}
          maxLength={3}
          required
        />

        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : editingId
              ? "Update Account"
              : "Add Account"}
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

      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <div>
          {accounts.map((account) => (
            <div key={account.id}>
              <h3>{account.name}</h3>

              <p>
                Type: {account.type}
              </p>

              <p>
                Currency: {account.currency}
              </p>

              <button
                type="button"
                onClick={() => handleEdit(account)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(account.id)}
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

export default Accounts;
