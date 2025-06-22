import React, { useState } from 'react';
import DataProcessor from './DataProcessor';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from '@chakra-ui/react';

const FileUploader: React.FC = ({ isOpen, onOpen, onClose, btnRef }: any) => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [sheetName, setSheetName] = useState('');
  const [keyColumn, setKeyColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const [showProcessor, setShowProcessor] = useState(false);
  const toast = useToast();

  const handleSubmit = () => {
    if (!jsonFile || !excelFile || !sheetName || !keyColumn || !valueColumn) {
      toast({
        title: "Missing Fields",
        description: "Please fill all fields and upload both files.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setShowProcessor(true);
    onClose(); // Optionally close the drawer on submit
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>📤 Upload Translation Files</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Upload JSON File</FormLabel>
                <Input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type === "application/json") {
                      setJsonFile(file);
                    } else {
                      toast({
                        title: "Invalid File",
                        description: "Please upload a valid JSON file.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                      e.target.value = '';
                    }
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Upload Excel / CSV File</FormLabel>
                <Input
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
                      toast({
                        title: "Invalid File",
                        description: "Please upload a valid Excel or CSV file.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                      e.target.value = '';
                    }
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Sheet Name</FormLabel>
                <Input
                  placeholder="e.g. Translations"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Key Column</FormLabel>
                <Input
                  placeholder="e.g. key"
                  value={keyColumn}
                  onChange={(e) => setKeyColumn(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Value Column</FormLabel>
                <Input
                  placeholder="e.g. value_en"
                  value={valueColumn}
                  onChange={(e) => setValueColumn(e.target.value)}
                />
              </FormControl>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit & Process
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Render the processor output */}
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
