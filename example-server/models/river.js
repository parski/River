'use strict';
const mongoose = require('mongoose');
const validator = require('validator')
const Schema = mongoose.Schema;

const River = new Schema({
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
            },
            _id: false
        }
    ],
}, { versionKey: false });

River.virtual('id').get(function(){
    return this._id.toHexString();
});

River.set('toJSON', {
    virtuals: true,
    transform: function (doc, river, options) {
        river.id = river._id;
        delete river._id;
    }
});

module.exports = mongoose.model('River', River);
