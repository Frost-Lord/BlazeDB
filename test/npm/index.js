const axios = require('axios');
const logger = require('./logger.js');

class BlazeDB {
    constructor(token, dbname, data = {}, Key = '', Value = '') {
        this.token = token;
        this.dbname = dbname;
        this.url = `http://localhost:4000/api/${token}/${dbname}`;
        this.changes = {};
        this.data = data;
        this.Key = Key;
        this.Value = Value;
    }

    getData() {
        const { changes, token, dbname, url, Key, Value, data, ...rest } = this;
        return { data, ...rest };
    }
      

    async create(data, schema) {
        try {
            const response = await axios.post(`${this.url}`, { data, schema });
            if (response.data.error) {
                logger.error('BlazeDB', response.data.error);
                return false;
            }
            return true;
        } catch (error) {
            logger.error('BlazeDB', error);
            return false;
        }
    }

    async findOne(Key, Value) {
        try {
            const response = await axios.post(`${this.url}/findone`, { Key, Value });
            if (response.data.error) {
                logger.error('BlazeDB', response.data.error);
                return null;
            } else {
                const dbData = new BlazeDB(this.token, this.dbname, response.data, Key, Value);
                return dbData;
            }
        } catch (error) {
            logger.error('BlazeDB', error);
            return null;
        }
    }    

    async update(changes) {
        try {
            const response = await axios.post(`${this.url}/update`, { Key: this.Key.Key, Value: this.Key.Value, data: this.changes });
            if (response.data.error) {
                logger.error('BlazeDB', response.data.error);
                return false;
            } else {
                Object.assign(this.data, changes);
                this.changes = {};
                return true;
            }
        } catch (error) {
            logger.error('BlazeDB', error);
            return false;
        }
    }

    async set(property, value) {
        const changes = this.changes;
        if (this.data[property] !== value) {
            this.changes[property] = value;
            this.data[property] = value;
        }
        const success = await this.update(changes);
        if (success) {
            return success;
        }
        return null;
    }

    async save() {
        const changes = this.changes;
        const modifiedData = {};
        for (const prop in changes) {
            if (changes.hasOwnProperty(prop)) {
                modifiedData[prop] = this.data[prop];
            }
        }
        const success = await this.update(changes);
        if (success) {
            return modifiedData;
        }
        return null;
    }
    
}

module.exports = BlazeDB;
