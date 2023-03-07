const axios = require('axios');

class BlazeDB {
    constructor(token, dbname) {
        this.token = token;
        this.dbname = dbname;
        this.url = `http://localhost:3000/api/${token}/${dbname}`;
    }

    async create(data, schema) {
        try {
            const response = await axios.post(`${this.url}`, { data, schema });
            if (response.data.error) {
                console.error(response.data.error);
                return false;
            }
            return true;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    async findOne(Key, Value) {
        try {
            const response = await axios.post(`${this.url}/findone`, { Key, Value });
            if (response.data.error) {
                console.error(response.data.error);
                return null;
            }
            
            return new BlazeDBData(response.data, Key, Value, this);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async update(Key, Value, data) {
        try {
            const response = await axios.post(`${this.url}/update`, { Key, Value, data });
            if (response.data.error) {
                console.error(response.data.error);
                return false;
            }
            return true;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }
}

class BlazeDBData {
    constructor(data, Key, Value, db) {
        this.Key = Key;
        this.Value = Value;
        this.db = db;
        this.changes = {};
        Object.assign(this, data);
    }

    save() {
        const changes = this.changes;
        return this.db.update(this.Key, this.Value, changes).then((success) => {
            if (success) {
                Object.assign(this, changes);
                this.changes = {};
                return true;
            } else {
                console.log("Failed to update data!");
                return null;
            }
        });
    }

    set(property, value) {
        if (this[property] !== value) {
            this.changes[property] = value;
            this[property] = value;
        }
    }
}


module.exports = BlazeDB;
