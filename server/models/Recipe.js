var mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
  name: {type:String, required:'{PATH} is required!'},
  featured: {type:Boolean, required:'{PATH} is required!'},
  style: {
    style_guide: {type:String, default:''},
    VERSION: { type:Number, default:1},
    name: { type:String, default:'Brown Porter'},
    STYLE_LETTER: { type:String, default:'A'},
    CATEGORY_NUMBER: { type:Number, default:12},
    TYPE: { type:String, default:'Ale'},
    OG_MIN: { type:Number, default:1.04},
    OG_MAX: { type:Number, default:1.052},
    FG_MIN: { type:Number, default:1.008},
    FG_MAX: { type:Number, default:1.014},
    IBU_MIN: { type:Number, default:18.0},
    IBU_MAX: { type:Number, default:35.0},
    COLOR_MIN: { type:Number, default:20.0},
    COLOR_MAX: { type:Number, default:30.0},
    ABV_MIN: { type:Number, default:4.0},
    ABV_MAX: { type:Number, default:5.4}
  },
  fermentables: [
    {
      NAME: {type:String, default:'Maris Otter Pale (UK)'},
      ORIGIN: {type:Number, default:0},
      TYPE: {type:String, default:'Base Malt'},
      YIELD: {type:Number, default:82.05571150939322},
      AMOUNT: {type:Number, default:4.082331330000001},
      DISPLAY_AMOUNT: {type:Number, default:9.0},
      POTENTIAL: {type:Number, default:1.038},
      COLOR: {type:Number, default:3},
      DISPLAY_COLOR: {type:Number, default:3},
      ADD_AFTER_BOIL: {type:Number, default:0},
      COARSE_FINE_DIFF: {type:Number, default:0},
      MOISTURE: {type:Number, default:0},
      DIASTATIC_POWER: {type:Number, default:0},
      PROTEIN: {type:Number, default:0},
      MAX_IN_BATCH: {type:Number, default:0},
      RECOMMEND_MASH: {type:Number, default:0},
      IBU_GAL_PER_LB: {type:Number, default:0},
      NOTES: {type:Number, default:0}
    }
  ],
  hops: [
    {
      NAME: {type:String, default:'Nugget (US)'},
      ORIGIN: {type:String, default:'United States'},
      ALPHA: {type:String, default:'14.3'},
      BETA: {type:String, default:''},
      AMOUNT: {type:String, default:'0.01417475'},
      DISPLAY_AMOUNT: {type:String, default:'0.5 oz'},
      USE: {type:String, default:'Boil'},
      FORM: {type:String, default:'Pellet'},
      TIME: {type:String, default:'60'},
      DISPLAY_TIME: {type:String, default:'60.0 min'},
      NOTES: {type:String, default:'Floral, resiny aroma and flavor. Primarily a bittering hop. Substitutes: Galena, Olympic.'},
      }
  ],
  yeasts: [
    {
      LABORATORY: {type:String, default:'White Labs'},
      NAME: {type:String, default:'Nottingham Ale Yeast'},
      TYPE: {type:String, default:'Ale'},
      FORM: {type:String, default:'Liquid'},
      ATTENUATION: {type:Number, default:77.5}
    }
  ],
  type: {type:String, default:'Extract'},
  brewer: {type:String, default:'Name'},
  batch_size: {type:Number, default:0},
  boil_size: {type:Number, default:0},
  boil_time: {type:Number, default:60},
  efficiency: {type:Number, default:75},
  created: {type:Date, required:'{PATH} is required!'}
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