var mongoose = require('mongoose');
const neatCsv = require('neat-csv');
const fs = require('fs');

var fermentableSchema = mongoose.Schema({
  fermentableType: {
    type:String,
    required: true
  },
  fermentableName: {
    type:String,
    required: true,
     default:'Extract'},
  color: {
    type:String,
    required: true,
    default:'0'
  },
  ppg: {type:Number, default:0}
});
var hopSchema = mongoose.Schema({
  country: {
    type:String,
    required: true
  },
  hopName: {
    type:String,
    required: true,
     default:'Extract'},
  alphaMin: {
    type:String,
    required: true
  },
  alphaMax: {
    type:String,
    required: true
  }
});
var yeastSchema = mongoose.Schema({
  laboratory: {
    type:String
  },
  yeastName: {
    type:String,
    required: true,
     default:'Extract'},
  yeastId: {
    type:String
  },
  yeastType: {
    type:String
  },
  alcoholTolerance: {
    type:String
  },
  flocculation: {
    type:String
  }
});
var extraSchema = mongoose.Schema({
  extraName: {
    type:String,
    required: true,
     default:'Poop'}
});
var styleSchema = mongoose.Schema({
  styleName: {
    type:String,
    required: true},
  og: {
    type:Number,
    required: true},
  fg: {
    type:Number,
    required: true},
  ibu: {
    type:Number,
    required: true},
  color: {
    type:String,
    required: true},
  abv: {
    type:String,
    required: true},
});
var Fermentable = mongoose.model('Fermentable', fermentableSchema);
var Hop = mongoose.model('Hop', hopSchema);
var Yeast = mongoose.model('Yeast', yeastSchema);
var Extra = mongoose.model('Extra', extraSchema);
var Style = mongoose.model('Style', styleSchema);

function createDefaultFermentables() {
  Fermentable.find({}).exec(function(err, collection) {
    if(collection.length === 0) {

      fs.readFile('./images/fermentables.csv', async (err, data) => {
        if (err) {
          console.error(err)
          return
        }
      csvData = await neatCsv(data)
      csvData.forEach(function(value){
        Fermentable.create({fermentableName: value.Fermentable, fermentableType: value.Type, color: value.Color, ppg: value.PPG});
      });
      // })
      })
    }
  })
}

function createDefaultHops() {
  Hop.find({}).exec(function(err, collection) {
    if(collection.length === 0) {

      fs.readFile('./images/hops.csv', async (err, data) => {
        if (err) {
          console.error(err)
          return
        }
      csvData = await neatCsv(data)
      csvData.forEach(function(value){
        Hop.create({country: value.Country, hopName: value.Hop, alphaMax:value.AlphaMax, alphaMin: value.AlphaMin});
      });
      // })
      })
    }
  })
}
function createDefaultYeasts() {
  Yeast.find({}).exec(function(err, collection) {
    if(collection.length === 0) {

      fs.readFile('./images/yeasts.csv', async (err, data) => {
        if (err) {
          console.error(err)
          return
        }
      csvData = await neatCsv(data)
      csvData.forEach(function(value){
        Yeast.create({laboratory: value.Laboratory, yeastName: value.Name, yeastId:value.ProductID, alcoholTolerance: value.AlcoholTolerance, flocculation: value.Flocculation});
      });
      // })
      })
    }
  })
}
function createDefaultExtras() {
  Extra.find({}).exec(function(err, collection) {
    if(collection.length === 0) {

      fs.readFile('./images/extras.csv', async (err, data) => {
        if (err) {
          console.error(err)
          return
        }
      csvData = await neatCsv(data)
      csvData.forEach(function(value){
        Extra.create({extraName: value.Name});
      });
      // })
      })
    }
  })
}
function createDefaultStyles() {
  Style.find({}).exec(function(err, collection) {
    if(collection.length === 0) {

      fs.readFile('./images/styles.csv', async (err, data) => {
        if (err) {
          console.error(err)
          return
        }
      csvData = await neatCsv(data)
      csvData.forEach(function(value){
        Style.create({styleName: value.Style, og: value.OG, fg: value.FG, ibu:value.IBU, color: value.Color, abv:value.ABV});
      });
      // })
      })
    }
  })
}

exports.createDefaultFermentables = createDefaultFermentables;
exports.createDefaultHops = createDefaultHops;
exports.createDefaultYeasts = createDefaultYeasts;
exports.createDefaultExtras = createDefaultExtras;
exports.createDefaultStyles = createDefaultStyles;