'use strict'

const Api = require('../models').Api;
const debug = require('debug')('trood:proxy/api');

exports.getApis = () => {
    return new Promise((resolve, reject) => {
        Api.find((err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
};

exports.getApiById = id => {
    return new Promise((resolve, reject) => {
        Api.findOne({_id: id}, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    });
}

exports.addApi = api_data => {
    return new Promise((resolve, reject) => {
        let api = new Api(api_data);
        api.save(err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

exports.removeApi = api_data => {
    return new Promise((resolve, reject) => {
        Api.remove(api_data, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

exports.updateApi = (id, api_date) => {
    return new Promise((resolve, reject) => {
        Api.update({_id: id}, api_date, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

exports.updateApiByCondition = (condition, api_date) => {
    return new Promise((resolve, reject) => {
        Api.update(condition, api_date, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}