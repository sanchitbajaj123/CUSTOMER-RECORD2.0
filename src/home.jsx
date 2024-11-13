import React, { useState,useEffect } from "react";
import "./home.css";
import Sidetable from "./sidetable";
import {add} from "./api";
function Home() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        frame: "",
        glasses: "",
        contactlens: "",
        rightSphDv: "",
        rightCylDv: "",
        rightAxisDv: "",
        rightPrismDv: "",
        rightSphNv: "",
        rightCylNv: "",
        rightAxisNv: "",
        rightPrismNv: "",
        rightAdd: "",
        leftSphDv: "",
        leftCylDv: "",
        leftAxisDv: "",
        leftPrismDv: "",
        leftSphNv: "",
        leftCylNv: "",
        leftAxisNv: "",
        leftPrismNv: "",
        leftAdd: "",
        total: "",
        advance: "",
        balance: "",
        remark: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const total = parseFloat(formData.total) || 0;
        const advance = parseFloat(formData.advance) || 0;
        setFormData((prevData) => ({
            ...prevData,
            balance: (total - advance).toFixed(2),
        }));
    }, [formData.total, formData.advance]);

    const handleSubmit = (e) => {
       
        console.log("Form Submitted");
        console.log("Customer Data Submitted:", formData);
    
        
        const newCustomer = {
            name: formData.name,
            phone: formData.phone,
            frame: formData.frame,
            glasses: formData.glasses,
            contactlens: formData.contactlens,
            remark: formData.remark,
            prescription: {
                right: {
                    sphDV: formData.rightSphDv,
                    cylDV: formData.rightCylDv,
                    axisDV: formData.rightAxisDv,
                    prismDV: formData.rightPrismDv,
                    sphNV: formData.rightSphNv,
                    cylNV: formData.rightCylNv,
                    axisNV: formData.rightAxisNv,
                    prismNV: formData.rightPrismNv,
                    add: formData.rightAdd,
                },
                left: {
                    sphDV: formData.leftSphDv,
                    cylDV: formData.leftCylDv,
                    axisDV: formData.leftAxisDv,
                    prismDV: formData.leftPrismDv,
                    sphNV: formData.leftSphNv,
                    cylNV: formData.leftCylNv,
                    axisNV: formData.leftAxisNv,
                    prismNV: formData.leftPrismNv,
                    add: formData.leftAdd,
                },
            },
            total: formData.total,
            advance: formData.advance,
            balance: formData.balance,
            dateAdded: new Date().toISOString().split('T')[0], // current date in YYYY-MM-DD format
            timeAdded: new Date().toLocaleTimeString(), // current time
        };
    
        // Send the constructed object to your API
        const submitData = async () => {
            await add(newCustomer);
        };
        
        submitData();
    
        //  Reset the form
        // setFormData({
        //     name: "",
        //     phone: "",
        //     frame: "",
        //     glasses: "",
        //     contactlens: "",
        //     rightSphDv: "",
        //     rightCylDv: "",
        //     rightAxisDv: "",
        //     rightPrismDv: "",
        //     rightSphNv: "",
        //     rightCylNv: "",
        //     rightAxisNv: "",
        //     rightPrismNv: "",
        //     rightAdd: "",
        //     leftSphDv: "",
        //     leftCylDv: "",
        //     leftAxisDv: "",
        //     leftPrismDv: "",
        //     leftSphNv: "",
        //     leftCylNv: "",
        //     leftAxisNv: "",
        //     leftPrismNv: "",
        //     leftAdd: "",
        //     total: "",
        //     advance: "",
        //     balance: "",
        //     remark: "",
        // });
        
    };
    
    

    return (
        <>
            <header>
                <nav className="red-2">
                    <div className="nav-wrapper">
                        <a href="#" className="brand-logo center">Misha Eye Care</a>
                        <a href="#" data-target="mobile-demo" className="sidenav-trigger">
                            <i className="material-icons">menu</i>
                        </a>
                        <ul className="right hide-on-med-and-down">
                            <li><a href="/pending">View balance left customers</a></li>
                        </ul>
                    </div>
                </nav>
            </header> 
            <ul className="sidenav" id="mobile-demo">
                <li><a href="/coming-soon">COMING SOON</a></li>
            </ul>

            <div className="main-content container">
                {/* Form Container */}
                <div className="form-container">
                    <center>
                        <h5>Add Customer</h5>
                    </center>
                    <form id="customerForm" onSubmit={handleSubmit}>
                        <div className="input-field">
                            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} />
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className="input-field">
                            <input id="phone" type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
                            <label htmlFor="phone">Phone</label>
                        </div>
                        <div className="input-field">
                            <input id="frame" type="text" name="frame" value={formData.frame} onChange={handleChange} />
                            <label htmlFor="frame">Frame</label>
                        </div>
                        <div className="input-field">
                            <input id="glasses" type="text" name="glasses" value={formData.glasses} onChange={handleChange} />
                            <label htmlFor="glasses">Glasses</label>
                        </div>
                        <div className="input-field">
                            <input id="contactlens" type="text" name="contactlens" value={formData.contactlens} onChange={handleChange} />
                            <label htmlFor="contactlens">Contact Lens</label>
                        </div>
                        
                        <div className="input-field">
                            <h6>Right Eye</h6>
                            <table className="prescription-table">
                                <thead>
                                    <tr>
                                        <th> </th>
                                        <th>SPH</th>
                                        <th>CYL</th>
                                        <th>AXIS</th>
                                        <th>PRISM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>D.V.</td>
                                        <td><input id="right-sph-dv" type="text" name="rightSphDv" value={formData.rightSphDv} onChange={handleChange} /></td>
                                        <td><input id="right-cyl-dv" type="text" name="rightCylDv" value={formData.rightCylDv} onChange={handleChange} /></td>
                                        <td><input id="right-axis-dv" type="text" name="rightAxisDv" value={formData.rightAxisDv} onChange={handleChange} /></td>
                                        <td><input id="right-prism-dv" type="text" name="rightPrismDv" value={formData.rightPrismDv} onChange={handleChange} /></td>
                                    </tr>
                                    <tr style={{"backgroundColor":"#ffffff"}}>
                                        <td>N.V.</td>
                                        <td><input id="right-sph-nv" type="text" name="rightSphNv" value={formData.rightSphNv} onChange={handleChange} /></td>
                                        <td><input id="right-cyl-nv" type="text" name="rightCylNv" value={formData.rightCylNv} onChange={handleChange} /></td>
                                        <td><input id="right-axis-nv" type="text" name="rightAxisNv" value={formData.rightAxisNv} onChange={handleChange} /></td>
                                        <td><input id="right-prism-nv" type="text" name="rightPrismNv" value={formData.rightPrismNv} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td>ADD</td>
                                        <td colSpan="4"><input id="right-add" type="text" name="rightAdd" value={formData.rightAdd} onChange={handleChange} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="input-field">
                            <h6>Left Eye</h6>
                            <table className="prescription-table">
                                <thead>
                                    <tr>
                                        <th> </th>
                                        <th>SPH</th>
                                        <th>CYL</th>
                                        <th>AXIS</th>
                                        <th>PRISM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>D.V.</td>
                                        <td><input id="left-sph-dv" type="text" name="leftSphDv" value={formData.leftSphDv} onChange={handleChange} /></td>
                                        <td><input id="left-cyl-dv" type="text" name="leftCylDv" value={formData.leftCylDv} onChange={handleChange} /></td>
                                        <td><input id="left-axis-dv" type="text" name="leftAxisDv" value={formData.leftAxisDv} onChange={handleChange} /></td>
                                        <td><input id="left-prism-dv" type="text" name="leftPrismDv" value={formData.leftPrismDv} onChange={handleChange} /></td>
                                    </tr>
                                    <tr style={{"backgroundColor":"#ffffff"}}>
                                        <td>N.V.</td>
                                        <td><input id="left-sph-nv" type="text" name="leftSphNv" value={formData.leftSphNv} onChange={handleChange} /></td>
                                        <td><input id="left-cyl-nv" type="text" name="leftCylNv" value={formData.leftCylNv} onChange={handleChange} /></td>
                                        <td><input id="left-axis-nv" type="text" name="leftAxisNv" value={formData.leftAxisNv} onChange={handleChange} /></td>
                                        <td><input id="left-prism-nv" type="text" name="leftPrismNv" value={formData.leftPrismNv} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td>ADD</td>
                                        <td colSpan="4"><input id="left-add" type="text" name="leftAdd" value={formData.leftAdd} onChange={handleChange} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="input-field">
                            <input id="total" type="number" name="total" value={formData.total} onChange={handleChange} />
                            <label htmlFor="total">Total</label>
                        </div>
                        <div className="input-field">
                            <input id="advance" type="number" name="advance" value={formData.advance} onChange={handleChange} />
                            <label htmlFor="advance">Advance</label>
                        </div>
                        <div className="input-field">
                            <input id="balance" type="number" name="balance" value={formData.balance} onChange={handleChange} />
                            
                        </div>
                        <div className="input-field" >
                            <input id="remark" type="text" name="remark" value={formData.remark} onChange={handleChange}></input>
                            <label htmlFor="remark">Remark</label>
                        </div>
                        <center>
                        <button type="submit" className="btn waves-effect waves-light red-2">
                            ADD
                        </button>
                        </center>
                    </form>
                </div>

                <Sidetable />
            </div>
        </>
    );
}

export default Home;
