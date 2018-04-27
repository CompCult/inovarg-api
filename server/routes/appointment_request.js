var express = require('express');
var router = express.Router();


var AppointmentRequest = require('../models/appointment_request.js');

//Index
router.get('/', function(req, res) {
  AppointmentRequest.find({}, function(err, requests) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(requests);
    }
  });
});

//Show
router.get('/:request_id', function(req, res) {
  AppointmentRequest.findById(req.params.request_id, function(err, request) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(request);
    }
  });
});

//Create
router.post('/', function(req, res) {
  var request           = new AppointmentRequest();
  request._appointment  = req.body._appointment;
  request.status        = req.body.status;
  request.message       = req.body.message;
  request.updated_at    = Date().now();

  request.save(function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(request);
    }
  });
});

// Update
router.put('/:request_id', function(req, res) {
  AppointmentRequest.findById(req.params.request_id, function(err, request) {
    if (req.body._appointment) request._appointment = req.body._appointment;
    if (req.body.status) {
      request.status     = req.body.status;

      request.updated_at = Date().now();
    }
    if (req.body.message) request.message = req.body.message;

    request.save(function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(request._id);
      }
    });
  });
});

// Delete
router.delete('/:request_id', function(req, res) {
  AppointmentRequest.remove({ _id: req.params.request_id }, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send("Compromisso removido.");
    }
  });
});

module.exports = router;