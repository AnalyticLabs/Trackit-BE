const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Provide board name"]
    },

    color:{
        type: String,
        required: [true, "Please Provide color"]
    },

    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, "Please provide the Project ID"]
    }
},
{
    timestamps:true,
});


module.exports = mongoose.model('Board', boardSchema);