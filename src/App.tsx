import { useState, type ReactNode } from 'react';
import './index.css'
import Terminal from './components/Terminal';
import DocView from './components/DocView';

function App() {

  const [docViewOpen, setDocViewOpen] = useState<boolean>(false);
  const [docText, setDocText] = useState<ReactNode | null>(null);

  const toggleDocView = (textElement: ReactNode) => {
    if (docViewOpen) {
      setDocViewOpen(false);
    } else {
      setDocText(textElement);
      setDocViewOpen(true);
    }
  }

  return (
    <>
      {docViewOpen &&
        <DocView toggleDocView={toggleDocView} textElement={docText}/>
      }
      <Terminal toggleDocView={toggleDocView} />
    </>
  )
}

export default App
