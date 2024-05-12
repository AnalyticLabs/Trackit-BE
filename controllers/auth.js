const { default: axios } = require("axios")
const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

exports.login =async(req,res)=>{
    const {token} = req.body

    try {
        let userData
        // Making call to monnit service for authentication of token
        try {
            // console.log(token)
            MONNIT_URL = process.env.MONNIT_URL

            const response = await  axios.post(
                MONNIT_URL+'/api/token-auth',
                {token},

            )

            // console.log(response.data.user)
            userData = response.data.user

        } catch (error) {
            return res.status(500).json({message: error.message})
        }

        // const userExists = User.findOne({userId:userData._id})

        const user = await User.create({userId:userData._id,username:userData.username})
        
        // signing token which saves 
        const accessToken = jwt.sign({ id: userData._id,trackItUserId:user._id }, process.env.ACCESS_SECRET, {
            expiresIn: process.env.ACCESS_EXPIRE,
        });
        const refreshToken = jwt.sign({ id: this._id ,trackItUserId:user._id}, process.env.REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_EXPIRE,
        });

        user.accessToken = accessToken
        user.refreshToken = refreshToken
        await user.save()

        // console.log(user.accessToken)

        return res.status(200).json({
            accessToken,
            refreshToken,
            userId:userData._id
        })

    } catch (error) {
        // console.log(error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}