import React, { lazy, Suspense, useState } from "react";

const StudentList = lazy(() => import("./Components/StudentList"));

const App: React.FC = () => {
  const [showList, setShowList] = useState(false);

  return (
    <div style={styles.container}>
      <h3>Welcome to Student Management</h3>
      <button onClick={() => setShowList((prev) => !prev)}>
        {showList ? "Hide Student List" : "Show Student List"}
      </button>
      
      {showList && (
        <Suspense fallback={null}>
          <StudentList />
        </Suspense>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
  } as React.CSSProperties,
};

export default App;
