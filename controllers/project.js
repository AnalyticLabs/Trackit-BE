const project = require("../models/project");

exports.addProject = async (req, res) => {
    const { name, ownership, key, manager, lead } = req.body;

    try {
        const newProject = new project({
            name,
            ownership,
            key,
            manager,
            lead
        });
        await newProject.save();
        res.status(200).json({ success: true, message: "Project added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Unable to add project. Server Error" });
    }

};