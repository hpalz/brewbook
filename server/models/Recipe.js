var mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
  name: {
    type:String,
    required: true
  },
  featured: {type:Boolean},
  style: {
    style_guide: {type:String, default:''},
    version: { type:Number, default:1},
    name: {
      type:String,
      required: true,
      default:'Brown Porter'
    },
    style_letter: { type:String, default:'A'},
    category_number: { type:Number, default:12},
    formType: { type:String, default:'Ale'},
    og_min: { type:Number, default:1.04},
    og_max: { type:Number, default:1.052},
    fg_min: { type:Number, default:1.008},
    fg_max: { type:Number, default:1.014},
    ibu_min: { type:Number, default:18.0},
    ibu_max: { type:Number, default:35.0},
    color_min: { type:Number, default:20.0},
    color_max: { type:Number, default:30.0},
    abv_min: { type:Number, default:4.0},
    abv_max: { type:Number, default:5.4}
  },
  fermentables: {
  fermentable: [
    {
      name: String,
     // origin: String,
      formType: String,
      yield: String,
      amount: String,
      display_amount: String,
      potential: String,
      color: String,
      display_color: String,
    /*  add_after_boil: String,
      coarse_fine_diff: String,
      moisture: String,
      diastatic_power: String,
      protein: String,
      max_in_batch: String,
      recommend_mash: String,
      ibu_gal_per_lb: String,
      notes: String,*/
    }
  ]
},
  hops: {
    hop:[
    {
      name: String,
      origin: String,
      alpha: String,
     // beta: String,
      amount: String,
      display_amount: String,
      use: String,
      form: String,
      time: String,
      display_time: String,
     // notes: String,
      }
  ]
},
  yeasts: {
    yeast:[
    {
      laboratory: String,
      name: String,
      formType: String,
      form: String,
      attenuation: String,
    }
  ]
},
  grainType: {type:String, default:'Extract'},
  brewer: {
    type:String,
    required: true,
    default:'name'
  },
  batch_size: {type:Number, default:0},
  boil_size: {type:Number, default:0},
  boil_time: {type:Number, default:60},
  efficiency: {type:Number, default:75},
  created: {
    type:Date,
    required: true
  }
});
var Recipe = mongoose.model('Recipe', recipeSchema);

function createDefaultRecipes() {
  Recipe.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      Recipe.create({name: 'test', featured: true, style: 'IPA', created: new Date('10/5/2013')});
    }
  })
}

exports.createDefaultRecipes = createDefaultRecipes;