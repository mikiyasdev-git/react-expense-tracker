import { useEffect, useState } from "react";
import {
  getReportSummary,
  getReportTransactions,
} from "../api/reportApi";

function Reports() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        setIsLoading(true);
        setError("");

        const [summaryResponse, transactionsResponse] =
          await Promise.all([
            getReportSummary(),
            getReportTransactions(),
          ]);

        setSummary(summaryResponse.data);
        setTransactions(transactionsResponse.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load reports."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadReports();
  }, []);

  if (isLoading) {
    return <p>Loading reports...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Reports</h2>

      {/* Summary */}
      <div>
        <div>
          <h3>Total Income</h3>
          <p>
            {Number(summary?.total_income || 0).toLocaleString()} ETB
          </p>
        </div>

        <div>
          <h3>Total Expense</h3>
          <p>
            {Number(summary?.total_expense || 0).toLocaleString()} ETB
          </p>
        </div>

        <div>
          <h3>Balance</h3>
          <p>
            {Number(summary?.balance || 0).toLocaleString()} ETB
          </p>
        </div>

        <div>
          <h3>Transactions</h3>
          <p>{summary?.transaction_count || 0}</p>
        </div>
      </div>

      {/* Transaction Report */}
      <div>
        <h3>Transaction Report</h3>

        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    {new Date(
                      transaction.transaction_date
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {transaction.description || "No description"}
                  </td>

                  <td>{transaction.type}</td>

                  <td>
                    {Number(transaction.amount).toLocaleString()} ETB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Reports;
