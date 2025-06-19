import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { get, set, cloneDeep } from 'lodash';
import ReactDiffViewer from 'react-diff-viewer';

interface DataProcessorProps {
  jsonFile: File;
  excelFile: File;
  sheetName: string;
  keyColumn: string;
  valueColumn: string;
}

interface ChangeEntry {
  path: string;
  oldValue: any;
  newValue: any;
  keep: boolean;
}

const DataProcessor: React.FC<DataProcessorProps> = ({
  jsonFile,
  excelFile,
  sheetName,
  keyColumn,
  valueColumn,
}) => {
  const [originalJson, setOriginalJson] = useState<any>(null);
  const [changes, setChanges] = useState<ChangeEntry[]>([]);
  const [finalJson, setFinalJson] = useState<any>(null);

  useEffect(() => {
    const parseFiles = async () => {
      try {
        const jsonText = await jsonFile.text();
        const original = JSON.parse(jsonText);
        const updated = cloneDeep(original);

        const buffer = await excelFile.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          alert(`Sheet "${sheetName}" not found in Excel file.`);
          return;
        }

        const excelData: Record<string, string>[] = XLSX.utils.sheet_to_json(worksheet);
        const changeList: ChangeEntry[] = [];

        excelData.forEach((row) => {
          const path = row[keyColumn];
          const newValue = row[valueColumn];
          // && path.trim().startsWith('lang') 
          if (
            typeof path === 'string' &&
            newValue !== undefined
          ) {
            const oldValue = get(updated, path);
            if (oldValue !== newValue) {
              set(updated, path, newValue);
              changeList.push({
                path,
                oldValue,
                newValue,
                keep: true, // default: keep the change
              });
            }
          }
        });

        setOriginalJson(original);
        setChanges(changeList);
        setFinalJson(updated); // Initial full updated JSON
      } catch (err) {
        console.error('Error processing files:', err);
        alert('Failed to process files. Please check the format.');
      }
    };

    parseFiles();
  }, [jsonFile, excelFile, sheetName, keyColumn, valueColumn]);

  const toggleKeep = (path: string) => {
    setChanges((prev) =>
      prev.map((c) =>
        c.path === path ? { ...c, keep: !c.keep } : c
      )
    );
  };

  const applyChanges = () => {
    if (!originalJson) return;
    const updated = cloneDeep(originalJson);
    changes.forEach((entry) => {
      if (entry.keep) {
        set(updated, entry.path, entry.newValue);
      }
    });
    setFinalJson(updated);
    alert('Final JSON updated with kept changes!');
  };

  const downloadFinalJson = () => {
    if (!finalJson) return;

    const blob = new Blob([JSON.stringify(finalJson, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'final-output.json';
    a.click();

    URL.revokeObjectURL(url);
    };

  return (
    <div className="mt-6 p-4 bg-gray-50 border rounded space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Review & Apply Changes</h3>

      {changes.length === 0 ? (
        <p className="text-sm text-gray-500">No differences found.</p>
      ) : (
        <div className="space-y-4">
          {changes.map((entry, idx) => (
            <div
              key={idx}
              className="p-4 border rounded bg-white shadow flex flex-col gap-2"
            >
              <div className="text-sm text-gray-800 font-medium">
                Path: <span className="font-mono">{entry.path}</span>
              </div>
              <div className="text-sm">
                <span className="text-red-600 font-semibold">Old:</span>{' '}
                <span className="font-mono">{JSON.stringify(entry.oldValue)}</span>
              </div>
              <div className="text-sm">
                <span className="text-green-600 font-semibold">New:</span>{' '}
                <span className="font-mono">{JSON.stringify(entry.newValue)}</span>
              </div>
              <div>
                <button
                  onClick={() => toggleKeep(entry.path)}
                  className={`mt-2 px-4 py-1 rounded text-sm font-semibold ${
                    !entry.keep
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {entry.keep ? 'Discard' : 'Keep'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {changes.length > 0 && (
    <div className="flex gap-4 mt-4">
        <button
        onClick={applyChanges}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-semibold"
        >
        Apply Kept Changes
        </button>

        <button
        onClick={downloadFinalJson}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm font-semibold"
        >
        Download Final JSON
        </button>
    </div>
      )}

      {finalJson && (
        <div>
          <h4 className="text-md font-semibold mt-6 mb-2">Final JSON Output (Kept Only)</h4>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">
            {JSON.stringify(finalJson, null, 2)}
          </pre>
           <h4 className="text-md font-semibold mt-6 mb-2">Code Diff Viewer</h4>
            <div className="border rounded bg-white">
            <ReactDiffViewer
                oldValue={JSON.stringify(originalJson, null, 2)}
                newValue={JSON.stringify(finalJson, null, 2)}
                splitView={true}
                leftTitle="Original"
                rightTitle="Updated"
                showDiffOnly={true}
            />
            </div>
        </div>
      )}

      
    </div>
  );
};

export default DataProcessor;
