import React, { useState, useMemo } from "react";
import Papa from "papaparse";

import { DataGrid } from "@material-ui/data-grid";
import "./App.css";

const App = () => {
  const [csvData, setCsvData] = useState(null);
  const [file, setFile] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const handleFileChange = (file) => {
    setFile(file);
  };

  const parseCSVData = async () => {
    Papa.parse(file, {
      complete: (result) => {
        const filteredResult = result.data.map((row) => {
          if (row[row.length - 1] === "") {
            return row.slice(0, 3);
          } else {
            return row;
          }
        });
        if (filteredResult[filteredResult.length - 1].length < 2) {
          filteredResult.pop();
        }
        setCsvData(filteredResult);
      },
      headers: true,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    parseCSVData();
    setShowTable(true);
  };

  const columns = useMemo(() => {
    if (!csvData) return [];

    return csvData[0].map((col) => {
      return {
        field: col === "ID" ? "id" : col,
        headerName: col,
        width: 100,
      };
    });
  }, [csvData]);

  const rows = useMemo(() => {
    if (!csvData) return [];

    return csvData.slice(1).map((row) => {
      return {
        id: row[0],
        PRICE: row[1],
        DATE: row[2],
      };
    });
  }, [csvData]);

  return (
    <div>
      <div className="App">
        <div className="main-container">
          <div className="form-container">
            <h1>Please upload CSV file here below</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="File"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
            
            <br/>
            {showTable && (
              <div
                className="table-container"
                style={{
                  height: 300,
                  width: "50%",
                  marginLeft: "350px",
                  marginBottom: "30px",
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  checkboxSelection
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
