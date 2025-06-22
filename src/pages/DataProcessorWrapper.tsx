// DataProcessorWrapper.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DataProcessor from '../components/DataProcessor';

const DataProcessorWrapper = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !state ||
      !state.jsonFile ||
      !state.excelFile ||
      !state.sheetName ||
      !state.keyColumn ||
      !state.valueColumn
    ) {
      navigate('/');
    }
  }, [state, navigate]);

  if (
    !state ||
    !state.jsonFile ||
    !state.excelFile ||
    !state.sheetName ||
    !state.keyColumn ||
    !state.valueColumn
  ) {
    return null; // render nothing while redirecting
  }

  return (
    <DataProcessor
      jsonFile={state.jsonFile}
      excelFile={state.excelFile}
      sheetName={state.sheetName}
      keyColumn={state.keyColumn}
      valueColumn={state.valueColumn}
    />
  );
};

export default DataProcessorWrapper;
