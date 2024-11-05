import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login'; // Import the Login component

import Home from './home'; // Import the Home component
import GetCustomer from './getcustomer'; // Import the GetCustomer component
import PendingBalance from './pendingbalance';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Define the Login route */}
          {/* Add other routes here as needed */}
          <Route path="/home" element={<Home />} /> {/* Define the Home route */}
          <Route path="/get-customer/:id" element={<GetCustomer />} /> {/* Define the GetCustomer route */}
          <Route path="/pending" element={<PendingBalance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
