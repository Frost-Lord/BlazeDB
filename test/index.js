const axios = require('axios');
const BlazeDB = require("./npm");

const db = new BlazeDB('435k2h7637c63hg76', 'testdb');

////////////////////////////////////////////////////////////////
// Test data structure
////////////////////////////////////////////////////////////////
const data = [
    {
        id: '1',
        name: 'John',
        age: 30,
        PastNames: ['John', 'Johnny', 'Johnathan'],
    },
]

////////////////////////////////////////////////////////////////
// Test schema structure
////////////////////////////////////////////////////////////////
const schema = {
    id: { type: String, default: null },
    name: { type: String, default: null },
    age: { type: Number, default: null },
    PastNames: { type: Array, default: [] },
};  

////////////////////////////////////////////////////////////////
// Test functions
////////////////////////////////////////////////////////////////
async function create() {
    const returndata = await db.create(data, schema);
    console.log("Data saved successfully!", returndata);
}

async function update() {
    const returndata = await db.findOne('id', '1');
    
    if (returndata) {
      returndata.set("name", "jake");
      returndata.set("age", 30);
      const data = await returndata.save();
    
    console.log("Data saved successfully!", data);
    } else {
    console.log("Data not found!");
    }
}

async function FindOne() {
    const returndata = await db.findOne('id', '1');
    console.log("Data found successfully!", returndata);
}


////////////////////////////////////////////////////////////////
// Test the functions above
////////////////////////////////////////////////////////////////
create();
update();
FindOne();