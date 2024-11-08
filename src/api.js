
const Api="https://customer-record-2-0.vercel.app";
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
export {add,load,getCustomer,deleteCustomer,clearBalance,pendingbalance}
