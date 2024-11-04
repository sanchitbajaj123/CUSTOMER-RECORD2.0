import React, { useEffect, useState } from "react";
import { load } from "./api";

function Sidetable() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const val = await load();
            setCustomers(val);
        };
        fetchData();
    }, []);

  
    const displayedCustomers = searchTerm
        ? customers.filter((customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer._id.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : customers;

    return (
        <div className="table-container">
            <div className="search-container">
                <input
                    id="search"
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <center>
                <h5>Customer List</h5>
            </center>
            <table className="highlight">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody id="customerTableBody">
                    {displayedCustomers.length > 0 ? (
                        displayedCustomers.map((customer) => (
                            <tr key={customer._id}>
                                <td>{customer.name}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.dateAdded}</td> {/* Adjust if the field name is different */}
                                <td>{customer.timeAdded}</td> {/* Adjust if the field name is different */}
                                <td>{customer._id}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No customers found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Sidetable;
