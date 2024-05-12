const mongoose = require("mongoose");
// const { connectDBs } = require("../DBconnection");

// const {trackitDB} = connectDBs();


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [false, "Please provide the project Name"],
    },
    ownership: {
        type: Object,
        required: [false, "Please provide the ownership Name"],
    },
    key: {
        type: String,
        unique: true,
        required: [false, "Please provide the key"],
    },
    manager: {
        type: Object,
        required: [false, "Please provide the manager Name"],
    },
    lead: {
        type: Object,
        required: [false, "Please provide the lead Name"],
    },

    companyId :{
        type:String,
        required: [true, "Please provide the companyId"],
    }


},
    {
        timestamps: true
    });

module.exports = mongoose.model('Project', projectSchema)
// module.exports = projectSchema