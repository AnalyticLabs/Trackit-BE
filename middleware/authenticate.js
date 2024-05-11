const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { default: axios } = require("axios");

const verifyToken = async (req, res, next) => {
    let tokenString;
    // console.log(req.headers);
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        tokenString = req.headers.authorization.split(" ")[1];
    }


    if (!tokenString) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(tokenString, process.env.ACCESS_SECRET);
        const user = await User.findById(decoded.trackItUserId);
        // console.log(decoded)
        // console.log(user)

         // check that the access token hasn't expired
         const tokenAge = Date.now() - decoded.createdAt;
         if (tokenAge > process.env.ACCESS_EXPIRE * 1000) {
             return res.status(420).json({ error: "Unable to authorize. Please login" });
         }

         
        if (!user) {
            return res.status(420).json({ error: "No user found with this id" });
        }
        if (user.accessToken !== tokenString)
            return res.status(420).json({ error: "Unable to authorize. Please login" });
        
        const token = user.accessToken;

        // Making call to monnit service for authentication of token
        try {
            // console.log(token)
            MONNIT_URL = process.env.MONNIT_URL

            const response = await  axios.post(
                MONNIT_URL+'/api/token-auth',
                {token},

            )

            // console.log(response.data.user)
            req.user = response.data.user
            req.trackItUserId = decoded.trackItUserId
            req.user.accessToken = user.accessToken

        } catch (error) {
            return res.status(500).json({message: error.message})
        }

        next();
    } catch (err) {
        // console.log(err)
        return res.status(404).json({ error: "Not authorized " });
    }
};
module.exports = verifyToken;
