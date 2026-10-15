import { useState } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  function addExpense(event) {
    event.preventDefault();

    if (!name.trim() || Number(amount) <= 0 || !amount || !date) {
      alert("Please enter valid details.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      name: name.trim(),
      amount: Number(amount),
      category,
      date,
    };

    setExpenses((previous) => [...previous, newExpense]);
    setName("");
    setAmount("");
    setCategory("Food");
  }

  function deleteExpense(id) {
    setExpenses((previous) =>
      previous.filter((expense) => expense.id !== id)
    );
  }

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryTotals = {};

  expenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount;
  });

  function money(value) {
    return "₹" + value.toFixed(2);
  }

  return (
    <div className="app">
      <header>
        <h1>Personal Expense Tracker</h1>
        <p>Record and analyze your daily expenses</p>
      </header>

      <div className="summary">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <h2>{money(total)}</h2>
        </div>

        <div className="summary-card">
          <h3>Number of Expenses</h3>
          <h2>{expenses.length}</h2>
        </div>

        <div className="summary-card">
          <h3>Categories Used</h3>
          <h2>{Object.keys(categoryTotals).length}</h2>
        </div>
      </div>

      <section className="panel">
        <h2>Add New Expense</h2>

        <form onSubmit={addExpense}>
          <label>Expense Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter expense name"
            required
          />

          <label>Amount (₹)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter amount"
            required
          />

          <label>Category</label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Education</option>
            <option>Bills</option>
            <option>Health</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />

          <button type="submit">Add Expense</button>
        </form>
      </section>

      <section className="panel">
        <h2>Expense Analysis</h2>

        {Object.keys(categoryTotals).length === 0 ? (
          <p className="empty">Add an expense to see the analysis.</p>
        ) : (
          Object.entries(categoryTotals).map(([cat, value]) => (
            <div className="analysis-row" key={cat}>
              <div className="analysis-label">
                <span>{cat}</span>
                <strong>{money(value)}</strong>
              </div>

              <div className="bar-background">
                <div
                  className="bar"
                  style={{
                    width:
                      (total > 0 ? (value / total) * 100 : 0) + "%",
                  }}
                />
              </div>

              <small>
                {((value / total) * 100).toFixed(1)}% of total
              </small>
            </div>
          ))
        )}
      </section>

      <section className="panel">
        <h2>Expense History</h2>

        {expenses.length === 0 ? (
          <p className="empty">No expenses recorded yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>{expense.name}</td>
                    <td>{expense.category}</td>
                    <td>{money(expense.amount)}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>Personal Expense Tracker | React Application</footer>
    </div>
  );
}

export default App;