import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login'; // Import the Login component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Define the Login route */}
          {/* Add other routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
