var mongoose = require('mongoose');
var Inventory = require('mongoose').model('Inventory');
var parser = require('xml2json');
var xmlImportUtility = require('../utilities/xmlImport');
var auth = require('../config/auth');

exports.getInventory = function(req, res) {
  var username = auth.username();
  Inventory.findOne({username:username}).exec(function(err, collection) {
    // had to put this shit into an array ._.
    if(collection!=null)
      res.send([collection]);
  })
};

exports.createInventory = function(req, res, next) {
  var inventoryId = req.body._id;
  var inventoryBody = req.body;
  var username = auth.username();
  if(inventoryId == undefined)
    {
    var newInventory = new Inventory ({
      _id: new mongoose.Types.ObjectId(),
      fermentables: inventoryBody.fermentables,
      hops: inventoryBody.hops,
      yeasts: inventoryBody.yeasts,
      username: username
    });
    Inventory.create(newInventory, function(err, inventory) {
      if(err) {
        // todo
      }
      res.send(inventory);
    })
  }
  else{
    var newInventory = new Inventory ({
      _id: inventoryId,
      fermentables: inventoryBody.fermentables,
      hops: inventoryBody.hops,
      yeasts: inventoryBody.yeasts, 
      username: username
    });
    
    Inventory.findByIdAndUpdate(inventoryId, newInventory, function(err, inventory) {
      if(err) {
        // todo
      }
      res.send(inventory);
    })

  }
};

exports.updateInventory = function(req, res) {
  var inventoryId = req.body._id;
  var inventoryBody = req.body;
  var username = auth.username();
  var newInventory = new Inventory ({
    _id: new mongoose.Types.ObjectId(),
    fermentables: inventoryBody.fermentables,
    hops: inventoryBody.hops,
    yeasts: inventoryBody.yeasts, 
    username: username
  });
  
  Inventory.findByIdAndUpdate(inventoryId, newInventory, function(err, inventory) {
    if(err) {
      // todo
    }
    res.send(inventory);
  })
};

exports.deleteInventory = function(req, res, next) {
  var inventoryId = req.body._id;
  
  Inventory.findByIdAndDelete(inventoryId, function(err, inventory) {
    if(err) {
      // todo
    }
    res.send(inventory);
  })
};