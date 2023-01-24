import React from 'react';
import TextBox from './TextBox';
import Blog from './Blog';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './Footer';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TextBox />} />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  </BrowserRouter>
);


export default App;
