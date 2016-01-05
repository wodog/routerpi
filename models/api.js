'use strict'

const db = require('./index').db;
const Schema = require('mongoose').Schema;

let ApiSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    desc: {type: String},
    request: {type: String},
    version: {type: String}
});

ApiSchema.index({name: 1});
ApiSchema.index({name: 1, type: 1}, {unique: true});

module.exports = db.model('Api', ApiSchema);