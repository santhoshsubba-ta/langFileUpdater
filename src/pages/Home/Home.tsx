import React from 'react';
import FileUploader from '../../components/FileUploader';
import {Heading, Text, useDisclosure} from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react'
import {HowItWorks} from '../../components/HowItWorks';
export const Home: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen:isOpenD, onOpen:onOpenD, onClose:onCloseD } = useDisclosure()
   const btnRef = React.useRef()
  return (
      <>
        <div className='h-screen text-center w-full flex flex-col justify-center items-center'>
            <Heading mb={6}>Effortless Lang File Updates from Excel</Heading>
            <Text fontSize='xl' mb={6}>
              Easily update multiple language JSON files using Excel sheets. 
              <br /> Detect changes, keep or discard updates
              <br />—no manual editing required!
            </Text>
            <ButtonGroup >
                <Button ref={btnRef} colorScheme='teal' onClick={onOpenD} variant='solid'>
                  Upload Files
                </Button>
                <Button onClick={onOpen} colorScheme='teal' variant='outline'>
                  🤔 How It Works
                </Button>
            </ButtonGroup>
        </div>
        <HowItWorks isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
        <FileUploader isOpen={isOpenD} onOpen={onOpenD} onClose={onCloseD} btnRef={btnRef}/>

      </>
  );
};
