const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses.length) {
    return <div className="empty-state">No transactions found. Add your first one above.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
              <td>
                <div className="expense-title">{exp.title}</div>
                {exp.description && <div className="expense-desc">{exp.description}</div>}
              </td>
              <td>
                <span className="badge" style={{ backgroundColor: exp.category?.color || '#64748b' }}>
                  {exp.category?.icon} {exp.category?.name || 'Uncategorized'}
                </span>
              </td>
              <td>
                <span className={`pill pill-${exp.type}`}>{exp.type}</span>
              </td>
              <td className={exp.type === 'income' ? 'amount-income' : 'amount-expense'}>
                {exp.type === 'income' ? '+' : '-'}
                {formatCurrency(exp.amount)}
              </td>
              <td className="actions-cell">
                <button className="btn btn-sm btn-ghost" onClick={() => onEdit(exp)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(exp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
