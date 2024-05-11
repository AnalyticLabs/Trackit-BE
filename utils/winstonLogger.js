const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const path = require("path");
const os = require("os");

const homedir = os.homedir();
const logFolderName = "TrackIt logs";
const logFolderPath = path.join(homedir, logFolderName);

// Creating folder for logging
exports.createFolder = () => {
  if (!fs.existsSync(logFolderPath)) {
    
    fs.mkdir(logFolderPath, () => {
      console.log(`Log Folder created successfully`);
    });
  }
};

// logger function
exports.logger = createLogger({
    
    format: format.combine(format.timestamp(), format.prettyPrint()),
    transports: [
        new transports.File({
            filename: path.join(logFolderPath, "logfile.log"),
            level: "info",
    }),
  ],
});

exports.errorLogger = createLogger({
  
    format: format.combine(format.timestamp(), format.prettyPrint()),
    transports: [
        new transports.File({
            filename: path.join(logFolderPath, "error.log"),
            level: "error",
    }),
  ],
});
