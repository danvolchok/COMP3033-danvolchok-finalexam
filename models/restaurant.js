const mongoose = require('mongoose');
const schemaDefObj = {
    name: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    phoneNumber: {
       type: String,
       require: true
    },
    emailAddress: {
       type: String,
       require: true
    },
    rating: {
       type: Number,
       require: true
    }
}

// create mongoose schema
const restaurantSchema = new mongoose.Schema(schemaDefObj)
// export mongoose model
module.exports = mongoose.model("Restaurant", restaurantSchema)