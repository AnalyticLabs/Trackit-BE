const { default: axios } = require("axios");

exports.getUserInfo = async(token,id) =>{
    try {
        const MONNIT_URL = process.env.MONNIT_URL

        
        const response = await axios.get(
            `${MONNIT_URL}/api/get-user-info?id=${id}`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        // console.log("usreInfo from api is:",response.data)
        return response.data.userInfo
        
    } catch (error) {
        console.log(error)
        return response.status(500).json({success:false,message:"Error getting user info"})
    }
}