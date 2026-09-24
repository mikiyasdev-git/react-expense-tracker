function Summary({ total, count, topCategory}) {
  return (
    <div className="summary">
      <div className="summary-card">
        <p className="summary-label">Total</p>
        <p className="summary-value">{total}</p>
      </div>
      <div className="summary-card">
        <p className="summary-label">Expenses</p>
        <p className="summary-value">{count}</p>
      </div>
      <div className="summary-card">
        <p className="summary-label">Top category</p>
        <p className="summary-value">{topCategory}</p>
      </div>
      
    </div>
  );
}

export default Summary;