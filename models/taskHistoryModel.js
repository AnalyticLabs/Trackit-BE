const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    user:{
        username:{
            type: String,
            required: [true, "Please Provide username"]
        },
        
        avtar:{
            type: String,
        }
        
    },

    assignee:{
        oldAssignee:{
            username:{
                type: String,
            },
            
            avtar:{
                type: String,
            }
            
        },

        newAssignee:{
            username:{
                type: String,
            },
            
            avtar:{
                type: String,
            }
            
        }
    },

    status:{
        oldStatus:{
            type: String,
        },

        newStatus:{
            type: String,
        }
    },

    type:{
        type: String,
        enum:["statusLog", "AssigneeLog"],
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


module.exports = mongoose.model('History', historySchema);