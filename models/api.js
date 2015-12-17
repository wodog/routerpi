'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ApiSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    desc: {type: String},
    request: {type: String}
});

ApiSchema.index({name: 1});
ApiSchema.index({name: 1, type: 1}, {unique: true});

module.exports = mongoose.model('Api', ApiSchema);