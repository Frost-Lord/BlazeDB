const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

mongoose
    .connect("mongodb://127.0.0.1:27017/blazedb", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Unable to connect to MongoDB Database.\nError: " + err);
    });
mongoose.connection.on("err", (err) => {
    console.error(`Mongoose connection error: \n ${err.stack}`);
});
mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection disconnected");
});

const validateData = (data, schema) => {
    const errors = [];

    for (const [key, value] of Object.entries(schema)) {
        const { type, default: defaultValue } = value;

        if (!data.hasOwnProperty(key) || data[key] === undefined || data[key] === null) {
            if (defaultValue === null) {
                errors.push(`Missing required field: ${key}`);
            } else {
                data[key] = defaultValue;
            }
        } else if (type && typeof data[key] !== type.name.toLowerCase()) {
            errors.push(`Invalid type for field ${key}: expected ${type.name}, got ${typeof data[key]}`);
        }
    }

    if (errors.length) {
        return errors.join('; ');
    } else {
        return null;
    }
};

const CreateLog = async (token, dbname, action) => {
    const LogSchema = require('./logs/schema/logs.js');
    const Logdb = await LogSchema.findOne({ token: token, dbname: dbname });

    if (Logdb) {
        Logdb.logs.push({
            action: action,
            time: Math.floor(Date.now() / 1000)
        })
        Logdb.save();
    } else {
        const newLog = new LogSchema({
            token: token,
            dbname: dbname,
            logs: [{
                action: action,
                time: Math.floor(Date.now() / 1000)
            }]
        });
        newLog.save();
    }
};


app.post('/api/:token/:dbname/logs', async (req, res) => {
    const { token, dbname } = req.params;

    const LogSchema = require('./logs/schema/logs.js');
    const dblogs = await LogSchema.findOne({ token: token, dbname: dbname });

    if (dblogs) {
        const response = {
            token: dblogs.token,
            dbname: dblogs.dbname,
            logs: dblogs.logs
        };
        return res.send(response);
    } else {
        return res.status(200).send({
            error: 'Logs not found'
        });
    }
});



app.post('/api/:token/:dbname', (req, res) => {
    const { token, dbname } = req.params;
    const { data, schema } = req.body;

    if (!data) {
        const db = {
            Schema: schema || {},
            Data: {}
        };
        fs.writeFile(`${dbname}.json`, JSON.stringify(db), (err) => {
            if (err) {
                console.error(err);
                return res.status(200).send({
                    error: 'Error creating database'
                });
            }
            console.log('Data saved to file.');
            res.send('Data saved successfully');
        });
        return;
    }

    const validation = validateData(data[0], schema);

    if (validation) {
        console.error(`Data validation failed: ${validation}`);
    } else {
        console.log(`Data validation successful: ${JSON.stringify(data)}`);
    }

    try {
        const db = {
            Schema: schema || {},
            Data: data
        };
        const dir = `./Storage/${token}/${dbname}`;
        const filename = `${dir}/${dbname}.json`;
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filename, JSON.stringify(db));
    } catch (e) {
        console.log(e)
    }

    console.log('Data saved to file.');
    res.send('Data saved successfully');
});


app.post('/api/:token/databases/getdbnames', (req, res) => {
    const { token } = req.params;

    try {
        const dir = `./Storage/${token}`;
        const filenames = fs.readdirSync(dir);


        const data = [];

        for (let i = 0; i < filenames.length; i++) {
            const filename = filenames[i];
            data.push({
                name: filename,
            });
        }


        if (filenames) {
            return res.send(filenames);
        } else {
            return res.status(200).send({
                error: 'Databases not found'
            });
        }
    } catch (e) {
        console.log(e)
        return res.status(200).send({
            error: 'Databases not found'
        });
    }
});


app.post('/api/:token/:dbname/getdata', (req, res) => {
    const { token, dbname } = req.params;

    const dir = `./Storage/${token}/${dbname}`;
    const filename = `${dir}/${dbname}.json`;

    fs.readFile(filename, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(200).send({
                error: 'Error connecting to the database'
            });
        }

        const documents = JSON.parse(data);

        if (documents) {
            return res.send(documents);
        } else {
            return res.status(200).send({
                error: 'Document not found'
            });
        }
    });
});

app.post('/api/:token/:dbname/findone', (req, res) => {
    const { token, dbname } = req.params;
    const { Key, Value } = req.body;

    CreateLog(token, dbname, `Read`);

    const dir = `./Storage/${token}/${dbname}`;
    const filename = `${dir}/${dbname}.json`;

    try {
        fs.readFile(filename, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    error: 'Error connecting to the database'
                });
            }

            try {
                const db = JSON.parse(data);
                const foundDocument = db.Data.find((doc) => doc[Key] === Value);

                if (foundDocument) {
                    return res.send(foundDocument);
                } else {
                    return res.status(404).send({
                        error: 'Document not found'
                    });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).send({
                    error: 'Error parsing database data'
                });
            }
        });
    } catch (e) {
        return res.status(500).send({
            error: 'Error connecting to the database'
        });
    }

});


app.post('/api/:token/:dbname/update', async (req, res) => {
    const { token, dbname } = req.params;
    const dir = `./Storage/${token}/${dbname}`;
    const filename = `${dir}/${dbname}.json`;

    CreateLog(token, dbname, `Update`);

    if (!fs.existsSync(filename)) {
        return res.status(404).send({ error: 'Database not found' });
    }

    const { Key, Value, data } = req.body;
    const db = JSON.parse(fs.readFileSync(filename));
    const matches = db.Data.filter((item) => item[Key] === Value);

    matches.forEach((item) => {
        Object.entries(data).forEach(([key, value]) => {
            item[key] = value;
        });
    });

    fs.writeFileSync(filename, JSON.stringify(db));

    res.send(matches);
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});