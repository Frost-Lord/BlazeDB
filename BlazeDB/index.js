const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const validateData = (data, schema) => {
    if (schema.type === 'array') {
        if (!Array.isArray(data)) {
            return { valid: false, message: 'Data is not an array' };
        }
        const missingItems = data.findIndex((item) => {
            const missingFields = schema.items.required.filter((field) => !item.hasOwnProperty(field));
            return missingFields.length > 0;
        });
        if (missingItems >= 0) {
            return { valid: false, message: `Missing required fields for item ${missingItems}: ${schema.items.required.join(', ')}` };
        }
        return { valid: true };
    } else {
        const missingFields = schema.required.filter((field) => !data.hasOwnProperty(field));
        if (missingFields.length > 0) {
            return { valid: false, message: `Missing required fields: ${missingFields.join(', ')}` };
        }

        for (const [field, type] of Object.entries(schema.properties)) {
            if (data.hasOwnProperty(field)) {
                const value = data[field];
                if (typeof value !== type) {
                    return { valid: false, message: `Invalid type for field ${field}. Expected ${type}, got ${typeof value}` };
                }
            }
        }

        return { valid: true };
    }
};


app.post('/api/:token/:dbname', (req, res) => {
    const { token, dbname } = req.params;
    const { data, schema } = req.body;


    if (!data) {
        fs.writeFile(`${dbname}.json`, JSON.stringify({ data: {}, schema }), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log('Data saved to file.');
            res.send('Data saved successfully');
        });
        return;
    }


    const validation = Array.isArray(data)
        ? data.map((item) => validateData(item, schema))
        : validateData(data, schema);

    const hasErrors = validation.some((result) => !result.valid);
    if (hasErrors) {
        res.status(400).send(validation);
        return;
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});