
const Api="http://localhost:5000";
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
export {add,load}