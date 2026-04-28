import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Terminal from './components/Terminal';
import DocViewer from './components/DocViewer';

function App() {
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleLoad = (val: boolean) => {
    setHasLoaded(val);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Terminal hasLoaded={hasLoaded} setHasLoaded={handleLoad} />} />
        <Route path="/docView" element={<DocViewer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
