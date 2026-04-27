import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Terminal from './components/Terminal';
import DocViewer from './components/DocViewer';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Terminal/>} />
        <Route path="/docView" element={<DocViewer/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
