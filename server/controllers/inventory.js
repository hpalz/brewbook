var mongoose = require('mongoose');
var Inventory = require('mongoose').model('Inventory');
var parser = require('xml2json');
var xmlImportUtility = require('../utilities/xmlImport');

exports.getInventory = function(req, res) {
  Inventory.find({}).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.getInventoryById = function(req, res) {
  Inventory.findOne({_id:req.params.id}).exec(function(err, inventory) {
    res.send(inventory);
  })
};

exports.createInventory = function(req, res, next) {
  var inventoryBody = req.body;
  var newInventory = new Inventory ({
    _id: new mongoose.Types.ObjectId(),
    fermentables: inventoryBody.fermentables,
    hops: inventoryBody.hops,
    yeasts: inventoryBody.yeasts
  });
  Inventory.create(newInventory, function(err, inventory) {
    if(err) {
      // todo
    }
    res.send(inventory);
  })
};

exports.deleteInventory = function(req, res, next) {
  var inventoryId = req.query.id;
  
  Inventory.findByIdAndDelete(inventoryId, function(err, inventory) {
    if(err) {
      // todo
    }
    res.send(inventory);
  })
};
/*
exports.importInventory = function(req, res, next) {
  var inventoryBody = req.body.inventorys.inventory;
  var i = 0;
  var newInventory = new Inventory ({
    _id: new mongoose.Types.ObjectId(),
    created: new Date(),
    style: JSON.parse(JSON.stringify(inventoryBody.style)),
    fermentables : JSON.parse(JSON.stringify(inventoryBody.fermentables)),
    hops : JSON.parse(JSON.stringify(inventoryBody.hops)),
    yeasts : JSON.parse(JSON.stringify(inventoryBody.yeasts)),
    name: inventoryBody.name,
    grainType: inventoryBody.type,
    boil_time: inventoryBody.boil_time,
    boil_size: inventoryBody.boil_size,
    batch_size: inventoryBody.batch_size,
    efficiency: inventoryBody.efficiency,
    brewer: inventoryBody.brewer,
    featured: true
  });

  Inventory.create(newInventory, function(err, inventory) {
    if(err) {
      // todo
    }
    res.send(inventory);
  })
};*/