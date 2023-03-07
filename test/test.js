const BlazeDB = require("./npm");

const db = new BlazeDB('435k2h7637c63hg76', 'testdb');

async function test() {
    const returndata = await db.findOne('id', '1');
    
    if (returndata) {
      returndata.set("name", "bob");
      returndata.set("age", 30);
      const data = await returndata.save();
    
    console.log("Data saved successfully!", data);
    } else {
    console.log("Data not found!");
    }
  }
test();