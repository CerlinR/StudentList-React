import React from "react";

interface StudentProps {
  student: { id: number; name: string };
  clickCount: number;
  onClick: () => void;
}

const StudentItem: React.FC<StudentProps> = ({ student, clickCount, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px",
        margin: "5px",
        border: "1px solid #ddd",
        cursor: "pointer",
        borderRadius: "5px",
      }}
    >
      {student.name} - Clicks: {clickCount}
    </div>
  );
};

export default StudentItem;
