import React, { useState, useEffect, useRef } from "react";
import Skeleton from "./Skeleton";

interface Student {
  id: number;
  name: string;
  class: string;
  section: string;
  contactNumber: string;
  status: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [bgColor, setBgColor] = useState("white");
  const [clickCounts, setClickCounts] = useState<{ [key: number]: number }>({});
  const renderCount = useRef(1); 

  useEffect(() => {
    if (renderCount.current > 1) {
      setBgColor("red"); 
    }
    renderCount.current += 1; 
  });

  useEffect(() => {
    setTimeout(() => {
      import("../data/students.json")
        .then((data) => {
          setStudents(data.default);

          const initialClickCounts: { [key: number]: number } = {};
          data.default.forEach((student: Student) => {
            initialClickCounts[student.id] = 0;
          });
          setClickCounts(initialClickCounts);
        })
        .catch((error) => console.error("Error loading student data:", error));
    }, 2000);
  }, []);

  const handleStudentClick = (id: number) => {
    setClickCounts((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  return (
    <div
      style={{
        marginTop: "30px",
        position: "relative",
        padding: "20px",
        backgroundColor: bgColor,
        borderRadius: "10px",
        transition: "background-color 0.5s ease-in-out",
      }}
    >
      <h2></h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th style={thStyle}>Student ID</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Class/Grade</th>
            <th style={thStyle}>Section</th>
            <th style={thStyle}>Contact Number</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Click Count</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {students ? (
            students.map((student) => (
              <tr
                key={student.id}
                onClick={() => handleStudentClick(student.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: clickCounts[student.id] ? "#f0f0f0" : "white",
                }}
              >
                <td style={tdStyle}>{student.id}</td>
                <td style={tdStyle}>{student.name}</td>
                <td style={tdStyle}>{student.class}</td>
                <td style={tdStyle}>{student.section}</td>
                <td style={tdStyle}>{student.contactNumber}</td>
                <td style={tdStyle}>{student.status}</td>
                <td style={tdStyle}>{clickCounts[student.id] || 0}</td>
              </tr>
            ))
          ) : (
            
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td style={tdStyle} colSpan={7}>
                  <Skeleton />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "12px",
        }}
      >
        Renders: {renderCount.current}
      </div>
    </div>
  );
};

const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  backgroundColor: "#f4f4f4",
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

export default StudentList;
