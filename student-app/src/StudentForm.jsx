import { useState } from "react";

function StudentForm({ onAddStudent }) {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [department, setDepartment] = useState("");
  const [marks, setMarks] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !roll.trim() || !department || marks === "") {
      alert("Please fill in all fields.");
      return;
    }

    onAddStudent({
      name: name.trim(),
      roll: roll.trim(),
      department,
      marks: Number(marks),
    });

    setName("");
    setRoll("");
    setDepartment("");
    setMarks("");
  }

  return (
    <div className="form-container">
      <h2>Student Registration Form</h2>

      <form onSubmit={handleSubmit}>
        <label>Student Name</label>
        <input
          type="text"
          placeholder="Enter student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Roll Number</label>
        <input
          type="text"
          placeholder="Enter roll number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          required
        />

        <label>Department</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">
            Information Technology
          </option>
          <option value="Mechanical Engineering">
            Mechanical Engineering
          </option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Electronics">Electronics</option>
        </select>

        <label>Marks (out of 100)</label>
        <input
          type="number"
          placeholder="Enter marks"
          min="0"
          max="100"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          required
        />

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}

export default StudentForm;