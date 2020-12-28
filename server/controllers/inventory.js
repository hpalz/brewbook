var mongoose = require('mongoose');
var Inventory = require('mongoose').model('Inventory');
var parser = require('xml2json');
var xmlImportUtility = require('../utilities/xmlImport');
var auth = require('../config/auth');

exports.getInventory = function(req, res) {
  var username = auth.username();
  Inventory.findOne({username:username}).exec(function(err, collection) {
    // had to put this shit into an array ._.
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