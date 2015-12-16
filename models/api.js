'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ApiSchema = new Schema({
    name: {type: String, required: true, unique: true},
    type: {type: String},
    desc: {type: String},
    request: {type: String}
});

ApiSchema.index({name: 1});

module.exports = mongoose.model('Api', ApiSchema);