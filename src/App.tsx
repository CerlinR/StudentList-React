import React, { lazy, Suspense, useState } from "react";

const StudentList = lazy(() => import("./Components/StudentList"));

const App: React.FC = () => {
  const [showList, setShowList] = useState(true);

  return (
    <div
      style={{
        marginBottom:"200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw", 
        height: "100vh",
        margin: 0, 
        padding: 0, 
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Welcome to Student Management</h3>
      <button onClick={() => setShowList((prev) => !prev)}>
         Student List
      </button>
      <Suspense fallback={<p>Loading Student List...</p>}>
        {showList && <StudentList />}
      </Suspense>
    </div>
  );
};

export default App;
