'use strict';

const mongoose = require('mongoose');
const River = mongoose.model('River');

exports.get = function(req, res) {
    River.findById(req.params.riverId, function(err, river) {
        if (err)
            res.send(err);
        res.json(river);
    });
};

exports.publish = function(req, res) {
    const river = new River(req.body);
    river.save(function(err, river) {
        if (err)
            res.send(err);
        res.json(river);
    });
};


exports.update = function(req, res) {
    River.findOneAndUpdate({ _id: req.params.riverId }, req.body, { new: true }, function(err, river) {
        if (err)
            res.send(err);
        res.json(river);
    });
};

exports.delete = function(req, res) {
    River.remove({ _id: req.params.riverId }, function(err, river) {
        if (err)
            res.send(err);
        res.json({ message: 'River successfully deleted' });
  });
};
