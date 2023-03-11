const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 4000;

app.use(bodyParser.json());

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




app.post('/api/:token/:dbname', (req, res) => {
    const { token, dbname } = req.params;
    const { data, schema } = req.body;


    if (!data) {
        fs.writeFile(`${dbname}.json`, JSON.stringify({ data: {}, schema }), (err) => {
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
        const dir = `./Storage/${token}/${dbname}`;
        const filename = `${dir}/${dbname}.json`;
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filename, JSON.stringify(data));
    } catch (e) {
        console.log(e)
    }


    console.log('Data saved to file.');
    res.send('Data saved successfully');
});

app.post('/api/:token/:dbname/getschema', (req, res) => {
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
    const foundDocument = documents.find((doc) => doc[Key] === Value);
    
    if (foundDocument) {
      return res.send(foundDocument);
    } else {
        return res.status(200).send({ 
            error: 'Document not found' 
        });
    }
  });
});

app.post('/api/:token/:dbname/update', (req, res) => {
    const { token, dbname } = req.params;
    const dir = `./Storage/${token}/${dbname}`;
    const filename = `${dir}/${dbname}.json`;
  
    if (!fs.existsSync(filename)) {
      return res.status(404).send({ error: 'Database not found' });
    }
  
    const { Key, Value, data } = req.body;
    const db = JSON.parse(fs.readFileSync(filename));
    const matches = db.filter((item) => item[Key] === Value);

    console.log("Key: " + Key, "Value: " + Value, "Matches: " + matches);
  
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