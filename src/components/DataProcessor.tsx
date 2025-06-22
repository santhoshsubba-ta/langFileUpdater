import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { get, set, cloneDeep } from 'lodash';
import {
  Box,
  Text,
  Button,
  Heading,
  VStack,
  HStack,
  Code,
  useToast,
  Divider,
  Flex,
} from '@chakra-ui/react';
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
  const toast = useToast();

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
          toast({
            title: 'Sheet not found',
            description: `Sheet "${sheetName}" not found in Excel file.`,
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
          return;
        }

        const excelData: Record<string, string>[] = XLSX.utils.sheet_to_json(worksheet);
        const changeList: ChangeEntry[] = [];

        excelData.forEach((row) => {
          const path = row[keyColumn];
          const newValue = row[valueColumn];

          if (typeof path === 'string' && newValue !== undefined) {
            const oldValue = get(updated, path);
            if (oldValue !== newValue) {
              set(updated, path, newValue);
              changeList.push({
                path,
                oldValue,
                newValue,
                keep: true,
              });
            }
          }
        });

        setOriginalJson(original);
        setChanges(changeList);
        setFinalJson(updated);
      } catch (err) {
        console.error('Error processing files:', err);
        toast({
          title: 'Processing failed',
          description: 'Failed to process files. Please check the format.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    parseFiles();
  }, [jsonFile, excelFile, sheetName, keyColumn, valueColumn]);

  const toggleKeep = (path: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.path === path ? { ...c, keep: !c.keep } : c))
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
    toast({
      title: 'Changes applied',
      description: 'Final JSON updated with kept changes.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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
    <Box mt={10} p={6} bg="gray.50" borderRadius="md" boxShadow="md">
      <Heading size="md" mb={4}>🔍 Review & Apply Changes</Heading>

      {changes.length === 0 ? (
        <Text color="gray.500">No differences found.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {changes.map((entry, idx) => (
            <Box key={idx} p={4} bg="white" borderWidth={1} borderRadius="md" boxShadow="sm">
              <Text fontWeight="medium">Path: <Code>{entry.path}</Code></Text>
              <Text><Text as="span" color="red.500" fontWeight="semibold">Old:</Text> <Code>{JSON.stringify(entry.oldValue)}</Code></Text>
              <Text><Text as="span" color="green.500" fontWeight="semibold">New:</Text> <Code>{JSON.stringify(entry.newValue)}</Code></Text>
              <Button
                onClick={() => toggleKeep(entry.path)}
                mt={2}
                size="sm"
                colorScheme={entry.keep ? 'gray' : 'green'}
                variant={entry.keep ? 'outline' : 'solid'}
              >
                {entry.keep ? 'Discard' : 'Keep'}
              </Button>
            </Box>
          ))}
        </VStack>
      )}

      {changes.length > 0 && (
        <HStack spacing={4} mt={6} className='flex justify-end w-full'>
          <Button colorScheme="blue" onClick={applyChanges}>Apply Kept Changes</Button>
          <Button colorScheme="green" onClick={downloadFinalJson}>Download Final JSON</Button>
        </HStack>
      )}

      {finalJson && (
        <Box mt={10}>
          <Heading size="sm" mb={2}>📦 Final JSON Output (Kept Only)</Heading>
          <Box bg="gray.100" p={4} borderRadius="md" maxH="400px" overflowY="auto">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(finalJson, null, 2)}</pre>
          </Box>

          <Divider my={6} />

          <Heading size="sm" mb={2}>🧠 Code Diff Viewer</Heading>
          <Box borderWidth={1} borderRadius="md" bg="white">
            <ReactDiffViewer
              oldValue={JSON.stringify(originalJson, null, 2)}
              newValue={JSON.stringify(finalJson, null, 2)}
              splitView={true}
              leftTitle="Original"
              rightTitle="Updated"
              showDiffOnly={true}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DataProcessor;
