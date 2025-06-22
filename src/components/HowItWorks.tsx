import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
} from '@chakra-ui/react'

export const HowItWorks = ({ isOpen, onOpen, onClose }: any) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'4xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🤔 How It Works</ModalHeader>
          <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" gap={3}>
            <Text>1️⃣ Click the <b>“Start Updating”</b> button to open the upload drawer.</Text>
            <Text>2️⃣ You'll find <b>five input fields</b> to configure the update:</Text>
            <Text pl={4}>• <b>Excel File</b> – Upload the Excel file.</Text>
            <Text pl={4}>• <b>JSON File</b> – Upload the original language JSON file to compare.</Text>
            <Text pl={4}>• <b>Sheet Name</b> – Enter the name of the sheet inside the Excel file you want to use.</Text>
            <Text pl={4}>• <b>Key & Value Column Names</b> – Specify the column names in Excel that represent keys and values.</Text>

            <Text>3️⃣ After filling all fields, click <b>“Generate”</b> to see the results.</Text>

            <Text>4️⃣ The tool will show differences between Excel and JSON:</Text>
            <Text pl={4}>• You can <b>Keep</b> or <b>Discard</b> individual changes.</Text>
            <Text pl={4}>• Click <b>“Apply Kept Changes”</b> to finalize selected updates.</Text>

            <Text>5️⃣ A side-by-side <b>file difference viewer</b> helps visualize what changed.</Text>

            <Text>6️⃣ Finally, click the <b>“Download”</b> button to get the updated JSON file.</Text>
            </ModalBody>


          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
