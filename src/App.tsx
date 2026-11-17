import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import Terminal from './components/Terminal';
import DocViewer from './components/DocViewer';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <> 
      <Analytics />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Terminal />} />
          <Route path="/view/*" element={<DocViewer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
