import axios from 'axios';
const Api="https://customer-record-2-0.vercel.app";
const Api2="http://localhost:5000";
async function add (data) {
    console.log(data);
    const response = await fetch(Api+"/add-customer", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });  
    console.log('API data:', response); 
    alert(data.name+" Added Successfully");
}
async function load(){
    const response = await fetch(Api+"/customers");
    const data = await response.json();
    console.log(data);
    return data;
}
async function getCustomer(id){
    const response = await fetch(Api+"/get-customer/"+id);
    const data = await response.json();
    console.log(data);
    return data;
}
async function deleteCustomer(id){
    const response = await fetch(Api+"/delete/"+id);
    const data = await response.json();
    console.log(data);
    return data;
}
async function clearBalance(id){
    const response = await fetch(Api+"/balanceclear/"+id);
    const data = await response.json();
    console.log(data);
    return data;
}
async function pendingbalance(){
    const response = await fetch(Api+"/pendingbalance");
    const data = await response.json();
    console.log(data);
    return data;
}
async function sms(id){
    const response = await fetch(Api2+"/sms/"+id);
    const data = await response.json();
    console.log(data);
    alert("SMS sent successfully");
    return data;
}
async function getqr() {
    const response = await axios.get(Api2+"/generateQR");
    console.log('QR code response:', response);
    return response;
}
export {add,load,getCustomer,deleteCustomer,clearBalance,pendingbalance,sms,getqr}
