import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

interface FileUploaderProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  btnRef: React.RefObject<HTMLButtonElement>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ isOpen, onClose, btnRef }) => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [sheetName, setSheetName] = useState('');
  const [keyColumn, setKeyColumn] = useState('');
  const [valueColumn, setValueColumn] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

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

    // Navigate to the processor page with state
    navigate('/process', {
      state: {
        jsonFile,
        excelFile,
        sheetName,
        keyColumn,
        valueColumn,
      },
    });

    onClose(); // Close the drawer
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
    </>
  );
};

export default FileUploader;
