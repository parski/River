'use strict';
const mongoose = require('mongoose');
const validator = require('validator')
const Schema = mongoose.Schema;

const River = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    revisions: [
        {
            date: {
                type: Date,
                required: true
            },
            url: {
                type: String,
                required: true,
                validate: (value) => {
                    return validator.isURL(value)
                }
            }
        }
    ]
});

module.exports = mongoose.model('River', River);
