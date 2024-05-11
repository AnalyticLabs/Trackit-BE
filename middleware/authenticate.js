const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { default: axios } = require("axios");
const { logger, errorLogger } = require("../utils/winstonLogger");

const verifyToken = async (req, res, next) => {
    let token;
    // console.log(req.headers);
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
       
        // Making call to monnit service for authentication of token
        try {

            logger.info({
                Route: "Authenticate middleware info logging",
                Token: token
            });

            // console.log(token)
            MONNIT_URL = process.env.MONNIT_URL

            const response = await  axios.post(
                MONNIT_URL+'/api/token-auth',
                {token},

            )

            // console.log(response.data.user)
            req.user = response.data.user
            // req.trackItUserId = decoded.trackItUserId
            req.user.accessToken = token

        } catch (error) {
            return res.status(500).json({message: error.message})
        }

        next();
    } catch (err) {
        // console.log(err)

         // Error logging
        errorLogger.error({
            Route: "Authenticate middleware",
            Error: err.message,
        });

        return res.status(404).json({ error: "Not authorized " });
    }
};
module.exports = verifyToken;
