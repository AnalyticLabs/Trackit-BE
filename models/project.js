const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide the project Name"],
    },
    ownership: {
        type: String,
        required: [true, "Please provide the ownership Name"],
    },
    key: {
        type: String,
        unquie: true,
        required: [true, "Please provide the key"],
    },
    manager: {
        type: String,
        required: [true, "Please provide the manager Name"],
    },
    lead: {
        type: String,
        required: [true, "Please provide the lead Name"],
    }

},
    {
        timestamps: true
    });

module.exports = mongoose.model('Project', projectSchema);