import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './protectedRoute/ProtectedRoute';
import Dashboard from './pages/Dashboard'

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />}></Route>
        <Route path='/register' element={<RegisterPage />}></Route>

        <Route path='/protected' element={<ProtectedRoute />}>
        
            <Route path='dash' element={<Dashboard />}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

