const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  itemId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Item"
  },
  version:Number,
  data:Object,
  modifiedAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model("ItemHistory",historySchema);