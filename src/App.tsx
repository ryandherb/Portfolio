import { useState, type ReactNode } from 'react';
import './index.css'
import Terminal from './components/Terminal';
import DocView from './components/DocView';

function App() {

  const [docViewOpen, setDocViewOpen] = useState<boolean>(false);
  const [docText, setDocText] = useState<ReactNode | null>(null);
  const [docTitle, setDocTitle] = useState<string>('');

  const toggleDocView = (textElement: ReactNode, textTitle?: string) => {
    if (docViewOpen) {
      setDocViewOpen(false);
    } else {
      setDocText(textElement);
      setDocTitle(textTitle ? textTitle : "Undefined");
      setDocViewOpen(true);
    }
  }

  return (
    <>
      {docViewOpen &&
        <DocView toggleDocView={toggleDocView} textElement={docText} docTitle={docTitle}/>
      }
      <Terminal toggleDocView={toggleDocView} />
    </>
  )
}

export default App
