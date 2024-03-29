const BlazeDB = require('./npm')

const db = new BlazeDB('435k2h7637c63hg76', 'maindb');

////////////////////////////////////////////////////////////////
// Test data structure
////////////////////////////////////////////////////////////////
const data = [
    {
        id: '1',
        name: 'John',
        age: 30,
        PastNames: ['John', 'Johnny', 'Johnathan'],
        Payments: [
        {
            id: '1',
            amount: 100,
            date: '2020-01-01',
        },
        {
            id: '2',
            amount: 200,
            date: '2020-01-02',
        },
        {
            id: '3',
            amount: 300,
            date: '2020-01-03',
        },
        ]
    },
    {
        id: '2',
        name: 'Mike',
        age: 20,
        PastNames: ['Mich', 'Mickel', 'jake'],
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
    Payments: { type: Array, default: [] },
};

////////////////////////////////////////////////////////////////
// Test functions
////////////////////////////////////////////////////////////////
async function create() {
    const returndata = await db.create(data, schema);
    console.log("Data Created Successfully!", returndata);
}

async function update() {
    const dbData = await db.findOne({ Key: 'id', Value: '1' });
    dbData.set("name", "Jake");
    dbData.set("age", 19);
}


async function FindOne() {
    const returndata = await db.findOne('id', '1');
    console.log(returndata ? 'Data Found Successfully! \n' + JSON.stringify(returndata.data) : 'Data Not Found!');
}  

////////////////////////////////////////////////////////////////
// Test the functions above
////////////////////////////////////////////////////////////////
//create();
//update();
FindOne();