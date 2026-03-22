const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  action:String,
  itemId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Item"
  },
  timestamp:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model("AuditLog",auditSchema);