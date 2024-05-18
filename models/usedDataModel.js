const mongoose = require("mongoose");

const usedDataSchema = new mongoose.Schema({

    board:{
        type:[mongoose.Schema.Types.ObjectId]
    },
    
    status:{
        type:[mongoose.Schema.Types.ObjectId]
    },

    issueTypes:{
        type:[mongoose.Schema.Types.ObjectId]
    },

    priorities:{
        type:[mongoose.Schema.Types.ObjectId]
    },

    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [false, "Please provide the Project ID"]
    }
},
{
    timestamps:true,
});


module.exports = mongoose.model('Used', usedDataSchema);