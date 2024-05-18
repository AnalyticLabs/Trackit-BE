const mongoose = require("mongoose");

const prioritySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Provide board name"],
        unique: true
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


module.exports = mongoose.model('Priority', prioritySchema);