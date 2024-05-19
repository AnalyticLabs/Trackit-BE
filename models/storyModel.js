const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    title:{
        type: String,
        unique: true,
        required: [true, "Please Provide epic title"]
    },

    description:{
        type: String,
        required: [true, "Please Provide epic decription"]
    },

    assignee:{
        type: String,
        required: [true, "Please provide the assigniee"],
    },

    tags:[{
        type:String,
        required: [true, "Please provide tags"],
    }],

    epicId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Epic',
        required: [true, "Please provide the Epic ID"]
    },
    
    
    
},
{
    timestamps:true,
});


module.exports = mongoose.model('Story', storySchema);