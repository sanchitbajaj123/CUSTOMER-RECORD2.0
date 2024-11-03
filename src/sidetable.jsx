import React,{useEffect,useState} from "react";
import load from "./api";
function  Sidetable() {
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        load(); // Call the load function to fetch data
    }, []);
    return (
        <div className="table-container">
            <div className="search-container">
                <input id="search" type="text" placeholder="Search customers..." />
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
                    {customers.length > 0 ? (
                        customers.map((customer) => (
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
                            <td colSpan="5">No customers found.</td> {/* Fallback message if no customers are present */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}
export default Sidetable;