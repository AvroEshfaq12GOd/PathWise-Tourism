import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TouristApp from './pages/TouristApp';
import AdminGate from './pages/AdminGate';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/app' element={<TouristApp/>} />
        <Route path='/admin' element={<AdminGate/>} />
      </Routes>
    </BrowserRouter>
  );
}
