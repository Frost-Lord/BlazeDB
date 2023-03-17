const mongoose = require("mongoose");

module.exports = mongoose.model("Logs", new mongoose.Schema({
    token: { type: String, default: null },
    dbname: { type: String, default: null },
    logs: { type: Array, default: [] },
    registeredAt: { type: Number, default: Date.now() },
 }));