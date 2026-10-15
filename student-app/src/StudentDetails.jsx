function StudentDetails({ students }) {
  return (
    <div className="details-container">
      <h2>Student Details</h2>

      {students.length === 0 ? (
        <p className="empty-message">
          No student records available. Please add a student.
        </p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Marks</th>
                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.roll}</td>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  <td>{student.marks}/100</td>
                  <td>
                    <span
                      className={
                        student.marks >= 40 ? "pass" : "fail"
                      }
                    >
                      {student.marks >= 40 ? "Pass" : "Fail"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentDetails;