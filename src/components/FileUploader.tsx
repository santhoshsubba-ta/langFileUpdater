import React, { useState } from 'react';
import DataProcessor from './DataProcessor';

const FileUploader: React.FC = () => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [sheetName, setSheetName] = useState('');
  const [keyColumn, setKeyColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [showProcessor, setShowProcessor] = useState(false);

  const handleSubmit = () => {
    if (!jsonFile || !excelFile || !sheetName || !keyColumn || !valueColumn) {
      alert("Please fill all fields and upload both files before submitting.");
      return;
    }
    setShowProcessor(true);
  };

  return (
    <>
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Upload & Configure</h2>

      <div className="space-y-4">
        {/* JSON Input */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Upload JSON File</label>
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type === "application/json") {
                setJsonFile(file);
              } else {
                alert("Please select a valid JSON file.");
                e.target.value = '';
              }
            }}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {/* Excel Input */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Upload Excel/CSV File</label>
          <input
            type="file"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => {
              const file = e.target.files?.[0];
              const allowed = [
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/csv"
              ];
              if (file && allowed.includes(file.type)) {
                setExcelFile(file);
              } else {
                alert("Please select a valid Excel or CSV file.");
                e.target.value = '';
              }
            }}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {/* Sheet, Key, Value Inputs */}
        <input
          type="text"
          placeholder="Sheet Name"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="text"
          placeholder="Key Column"
          value={keyColumn}
          onChange={(e) => setKeyColumn(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="text"
          placeholder="Value Column"
          value={valueColumn}
          onChange={(e) => setValueColumn(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>

    </div>
    <div className="w-3/4 mx-auto">
          {showProcessor && jsonFile && excelFile && (
            <DataProcessor
            jsonFile={jsonFile}
            excelFile={excelFile}
            sheetName={sheetName}
            keyColumn={keyColumn}
            valueColumn={valueColumn}
            />
        )}
    </div>
    </>
  );
};

export default FileUploader;
