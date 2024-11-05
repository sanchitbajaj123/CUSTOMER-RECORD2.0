import React, { useState, useEffect } from "react";
import { pendingbalance } from "./api";
import "./PendingBalance.css";

function PendingBalance() {
    const [pending, setPending] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPending = async () => {
            const data = await pendingbalance();
            setPending(data);
        };
        fetchPending();
    }, []);

    // Filter based on search term
    const filteredData = pending.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        (item.balance && item.balance.toString().includes(searchTerm))
    );

    if (!pending.length) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="pending-balance-container">
            <h1>Pending Balances</h1>
            <input
                type="text"
                placeholder="Search by name, number, or balance"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <table className="balance-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((customer) => (
                        <tr key={customer._id}>
                            <td>{customer.name || "N/A"}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.balance || "0"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PendingBalance;
