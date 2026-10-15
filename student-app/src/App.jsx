import { useState } from "react";
import StudentForm from "./StudentForm.jsx";
import StudentDetails from "./StudentDetails.jsx";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  function addStudent(student) {
    setStudents((previousStudents) => [
      ...previousStudents,
      student,
    ]);
  }

  return (
    <div className="app">
      <header>
        <h1>Student Information System</h1>
        <p>Register students and view their details</p>
      </header>

      <main>
        <StudentForm onAddStudent={addStudent} />

        <StudentDetails students={students} />
      </main>

      <footer>
        <p>Student Information Application Using React</p>
      </footer>
    </div>
  );
}

export default App;