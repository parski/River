'use strict';

const mongoose = require('mongoose');
const River = mongoose.model('River');

exports.get = function(request, response) {
    River.findById(request.params.riverId, function(error, river) {
        if (error)
            response.send(error);
        response.json(river);
    });
};

exports.publish = function(request, response) {
    const river = new River(request.body);
    river.save(function(error, river) {
        if (error)
            response.send(error);
        response.json(river);
    });
};


exports.update = function(request, response) {
    River.findOneAndUpdate({ _id: request.params.riverId }, request.body, { new: true }, function(error, river) {
        if (error)
            response.send(error);
        response.json(river);
    });
};

exports.delete = function(request, response) {
    River.deleteOne({ _id: request.params.riverId }, function(error, river) {
        if (error)
            response.send(error);
        response.json({ message: 'River successfully deleted' });
  });
};
