const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user:{
        username:{
            type: String,
            required: [true, "Please Provide username"]
        },
        
        avtar:{
            type: String,
        }
        
    },

    comment:{
        type: String,
        required: [true, "Please Provide comment "]
    },

    time:{
        type: Date,
        required: [true, "Please provide the time"],
    },



    task:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: [true, "Please provide the Task ID"]
    },
    
    
    
},
{
    timestamps:true,
});


module.exports = mongoose.model('Comment', commentSchema);