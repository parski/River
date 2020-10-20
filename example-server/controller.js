'use strict';

const mongoose = require('mongoose');
const River = mongoose.model('River');

exports.get = function(request, response) {
    River.findById(request.params.riverId, function(error, river) {
        if (error) {
            response.status(400).send(error)
            return
        }
        
        if (!river) {
            response.status(404).send()
            return
        }

        response.json(river)
    });
};

exports.publish = function(request, response) {
    const river = new River(request.body);
    river.save(function(error, river) {
        if (error) {
            response.status(400).send(error)
            return
        }

        response.json(river)
    });
};


exports.update = function(request, response) {
    const updatedRiver = new River(request.body)
    updatedRiver.validate().then(() => {
        River.findOneAndUpdate({ _id: request.params.riverId }, request.body, { new: true }, function(error, river) {
            if (error) {
                response.status(400).send(error)
                return
            }
    
            if (!river) {
                response.status(404).send()
                return
            }
    
            response.json(river)
        });
    })
    .catch(error => {
        response.status(400).send(error)
    })
}

exports.delete = function(request, response) {
    River.deleteOne({ _id: request.params.riverId }, function(error, result) {
        if (error) {
            response.status(400).send(error)
            return
        }

        console.log(result)
            
        if (result.deletedCount == 0) {
            response.status(204).send()
            return
        }

        response.status(200).send()
  });
};
