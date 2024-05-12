const mongoose = require("mongoose");

const issueTypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Provide board name"]
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


module.exports = mongoose.model('IssueType', issueTypeSchema);