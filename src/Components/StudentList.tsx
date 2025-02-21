import React, { useState, useEffect, useRef, useCallback } from "react";

interface Student {
  id: number;
  name: string;
  class: string;
  section: string;
  contactNumber: string;
  status: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [clickCounts, setClickCounts] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const renderCount = useRef(0);
  const isFirstMount = useRef(true);
  const [backgroundColor, setBackgroundColor] = useState("#f8f9fa");

  renderCount.current += 1;

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
    } else {
      setBackgroundColor("#ffcccc");
    }
  }, []);

  useEffect(() => {
    fetchMoreStudents();
  }, []);

  const fetchMoreStudents = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      import("../data/students.json")
        .then((data) => {
          const totalRecords = data.default.length;
          const startIndex = (pageRef.current - 1) * 10;
          const endIndex = pageRef.current * 10;

          const newStudents = data.default.slice(startIndex, endIndex);

          if (newStudents.length > 0) {
            setStudents((prev) => [...prev, ...newStudents]);
            pageRef.current += 1;
          }

          if (endIndex >= totalRecords) {
            setHasMore(false);
          }
        })
        .catch((error) => console.error("Error loading students:", error))
        .finally(() => setLoading(false));
    }, 1000);
  }, [loading, hasMore]);

  const lastStudentRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreStudents();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchMoreStudents, hasMore]
  );

  // ✅ Function to handle student row click
  const handleStudentClick = (id: number) => {
    setClickCounts((prevCounts) => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 0) + 1,
    }));
  };

  return (
    <div style={{ ...styles.container, backgroundColor }}>
      <div style={styles.reRenderCount}>Re-renders: {renderCount.current}</div>
      <div style={styles.scrollableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Class</th>
              <th style={styles.th}>Section</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                ref={index === students.length - 1 ? lastStudentRef : null}
                style={styles.tr}
                onClick={() => handleStudentClick(student.id)}
              >
                <td style={styles.td}>{student.id}</td>
                <td style={styles.td}>{student.name}</td>
                <td style={styles.td}>{student.class}</td>
                <td style={styles.td}>{student.section}</td>
                <td style={styles.td}>{student.contactNumber}</td>
                <td style={styles.td}>{student.status}</td>
                <td style={styles.td}>{clickCounts[student.id] || 0}</td>
              </tr>
            ))}
            {loading &&
              Array(3)
                .fill(null)
                .map((_, index) => (
                  <tr key={`skeleton-${index}`} style={styles.skeletonRow}>
                    <td style={styles.skeletonCell} colSpan={7}></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    top:"3%",
    width: "100%",
    padding: "20px",
    position: "relative",
    transition: "background-color 0.5s ease-in-out",
  } as React.CSSProperties,
  reRenderCount: {
    position: "absolute",
    top: "-50px",
    right: "40px",
    backgroundColor: "#007bff",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "14px",
  } as React.CSSProperties,
  scrollableContainer: {
    width: "90%",
    height: "70vh",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "white",
    marginLeft: "5%",
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse",
  } as React.CSSProperties,
  th: {
    padding: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#f4f4f4",
    textAlign: "center" as const,
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center" as const,
  },
  tr: {
    cursor: "pointer",
    transition: "background-color 0.2s",
  } as React.CSSProperties,
  
  skeletonRow: {
    backgroundColor: "#f0f0f0",
    height: "20px",
    borderRadius: "4px",
    animation: "pulse 1.5s infinite ease-in-out",
  } as React.CSSProperties,
  skeletonCell: {
    padding: "10px",
    backgroundColor: "#e0e0e0",
  } as React.CSSProperties,
};

export default StudentList;
