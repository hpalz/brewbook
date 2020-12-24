var mongoose = require('mongoose');

var inventorySchema = mongoose.Schema({
  fermentables:  [
      {
        name: String,
        weight: String,
        unit: String
      }
    ],
  hops: [
      {
        name: String,
        origin: String,
        alpha: String,
        amount: String,
        display_amount: String,
        use: String,
        form: String,
        time: String,
        display_time: String
      }
    ],
  yeasts:  [
      {
        laboratory: String,
        name: String,
        formType: String,
        form: String,
        attenuation: String,
      }
    ]
});
var Inventory = mongoose.model('Inventory', inventorySchema);

function createDefaultInventory() {
  Inventory.find({}).exec(function (err, collection) {
    if (collection.length === 0) {
      //Inventory.create({ name: 'test', featured: true, style: 'IPA', created: new Date('10/5/2013') });
    }
  })
}

exports.createDefaultInventory = createDefaultInventory;