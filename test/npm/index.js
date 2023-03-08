const axios = require('axios');
const logger = require('./logger.js');

class BlazeDB {
    constructor(token, dbname, data = {}, Key = '', Value = '') {
        this.token = token;
        this.dbname = dbname;
        this.url = `http://localhost:3000/api/${token}/${dbname}`;
        this.changes = {};
        Object.assign(this, data);
        this.Key = Key;
        this.Value = Value;
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
                dbData.changes = {};
                return dbData;
            }
        } catch (error) {
            logger.error('BlazeDB', error);
            return null;
        }
    }

    async update(changes) {
        try {
            console.log("Update:", changes);
            const response = await axios.post(`${this.url}/update`, { Key: this.Key, Value: this.Value, changes });
            if (response.data.error) {
                logger.error('BlazeDB', response.data.error);
                return false;
            } else {
                Object.assign(this, changes);
                this.changes = {};
                return true;
            }
        } catch (error) {
            logger.error('BlazeDB', error);
            return false;
        }
    }

    set(property, value) {
        if (this[property] !== value) {
            this.changes[property] = value;
            this[property] = value;
        }
        this.save();
    }

    async save() {
        const changes = this.changes;
        return await this.update(changes);
    }
}

module.exports = BlazeDB;