const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Provide board name"]
    },

    before:{
        type: String,
        required: [false, "Please Provide color"]
    },

    after:{
        type: String,
        required: [false, "Please Provide color"]
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


module.exports = mongoose.model('Status', statusSchema);