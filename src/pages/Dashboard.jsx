import Summary from "../components/Summary";

function Dashboard({ total, count, topCategory, isLoading, fetchError }) {
  return (
    <div>
      {isLoading && <p className="status-message">Loading starter expenses...</p>}
      {fetchError && (
        <p className="status-message status-error">
          {fetchError} Showing default expenses instead.
        </p>
      )}
      <Summary total={total} count={count} topCategory={topCategory} />
    </div>
  );
}

export default Dashboard;