import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCustomer } from "./api";
import './get.css';

function GetCustomer() {
    const [customer, setCustomer] = useState(null);
    const { id } = useParams(); 

    useEffect(() => {
        const fetchCustomer = async () => {
            const data = await getCustomer(id);
            setCustomer(data);
        };
        fetchCustomer();
    }, [id]);

    if (!customer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="contm">
            <div className="customer-info">
                <center>
                    <h3 style={{ margin: "0px", fontSize: "36px", fontWeight: "bold" }}>MISHA EYE CARE</h3>
                </center>

                <h5 id="customer-name">{customer.name}</h5>
                <p>
                    <i className="material-icons left">phone</i>
                    <strong>Phone:</strong> <span id="customer-phone">{customer.phone}</span>
                </p>
                <p>
                    <i className="material-icons left">description</i>
                    <strong>Frame:</strong> <span id="customer-frame">{customer.frame}</span>
                </p>
                <p>
                    <i className="material-icons left">remove_red_eye</i>
                    <strong>Glasses:</strong> <span id="customer-glasses">{customer.glasses}</span>
                </p>
                <p>
                    <i className="material-icons left">visibility</i>
                    <strong>Contact Lens:</strong> <span id="customer-contact-lens">{customer.contactLens}</span>
                </p>

                <div className="input-field">
                    <h6>Prescription</h6>
                    <table className="prescription-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Sph (DV)</th>
                                <th>Cyl (DV)</th>
                                <th>Axis (DV)</th>
                                <th>Prism (DV)</th>
                                <th>Sph (NV)</th>
                                <th>Cyl (NV)</th>
                                <th>Axis (NV)</th>
                                <th>Prism (NV)</th>
                                <th>Add</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Right Eye</strong></td>
                                <td><span id="customer-right-sph-dv">{customer.prescription.right.sphDV}</span></td>
                                <td><span id="customer-right-cyl-dv">{customer.prescription.right.cylDV}</span></td>
                                <td><span id="customer-right-axis-dv">{customer.prescription.right.axisDV}</span></td>
                                <td><span id="customer-right-prism-dv">{customer.prescription.right.prismDV}</span></td>
                                <td><span id="customer-right-sph-nv">{customer.prescription.right.sphNV}</span></td>
                                <td><span id="customer-right-cyl-nv">{customer.prescription.right.cylNV}</span></td>
                                <td><span id="customer-right-axis-nv">{customer.prescription.right.axisNV}</span></td>
                                <td><span id="customer-right-prism-nv">{customer.prescription.right.prismNV}</span></td>
                                <td><span id="customer-right-add">{customer.prescription.right.add}</span></td>
                            </tr>
                            <tr>
                                <td><strong>Left Eye</strong></td>
                                <td><span id="customer-left-sph-dv">{customer.prescription.left.sphDV}</span></td>
                                <td><span id="customer-left-cyl-dv">{customer.prescription.left.cylDV}</span></td>
                                <td><span id="customer-left-axis-dv">{customer.prescription.left.axisDV}</span></td>
                                <td><span id="customer-left-prism-dv">{customer.prescription.left.prismDV}</span></td>
                                <td><span id="customer-left-sph-nv">{customer.prescription.left.sphNV}</span></td>
                                <td><span id="customer-left-cyl-nv">{customer.prescription.left.cylNV}</span></td>
                                <td><span id="customer-left-axis-nv">{customer.prescription.left.axisNV}</span></td>
                                <td><span id="customer-left-prism-nv">{customer.prescription.left.prismNV}</span></td>
                                <td><span id="customer-left-add">{customer.prescription.left.add}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    <i className="material-icons left">comment</i>
                    <strong>Remarks:</strong> <span id="customer-remarks">{customer.remarks}</span>
                </p>
                <p>
                    <i className="material-icons left">date_range</i>
                    <strong>Date Added:</strong> <span id="customer-date-added">{customer.dateAdded}</span>
                </p>
                <p>
                    <i className="material-icons left">access_time</i>
                    <strong>Time Added:</strong> <span id="customer-time-added">{customer.timeAdded}</span>
                </p>
                <p><strong>Total:</strong> <span id="customer-total">{customer.total}</span></p>
                <p><strong>Advance:</strong> <span id="customer-advance">{customer.advance}</span></p>
                <p><strong>Balance:</strong> <span id="customer-balance">{customer.balance}</span></p>
                <div style={{"margin-bottom":"3px"}} className="center-align  back-button">
                    <a href="/home" className="btn blue waves-effect waves-light">Back to Home</a>
                </div>
                <div style={{"margin-bottom":"3px"}} className="center-align back-button">
                    <button className="btn blue waves-effect waves-light">BALANCE CLEAR</button>
                </div>
                <div className="center-align back-button">
                    <button className="btn blue waves-effect waves-light">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default GetCustomer;
