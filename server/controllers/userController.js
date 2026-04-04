/**
 * Controller for the state of the user and 
 * the other users
 * Includes all the follow functionality
 */

const User = require("../models/User");

/**
 * Add the follow of a specific user,
 * push the id of the user in the followers of the requested user
 * push the id of the requested user in the followings of the requested user
 * if the user already followed the requested user,
 * removes the id of the user and the id of the requested user respectively
 * in the followings and the followers
 * Requires a valid userId and a valid userToFollowId
 * @returns {Object} Json response with a success or fail message
 */
exports.follow = async (req, res) => {
    try {
        const {userId} = req.user; 

        const userToFollowId = req.params.id;

        const user = await User.findById(userId);
        const userToFollow = await User.findById(userToFollowId);

        if (!user || !userToFollow) {
            return res.status(404).json({
                success: false,
                message: "Utente non trovato"
            })
        }

        if (!user.followings.includes(userToFollowId)) {
            await userToFollow.updateOne({ $push: { followers: userId } });
            await user.updateOne({ $push: { followings: userToFollowId }});
            return res.status(200).json({
                success: true,
                message: "Utente aggiunto ai seguiti"
            })
        } else {
            await userToFollow.updateOne({ $pull: { followers: userId } });
            await user.updateOne({ $pull: { followings: userToFollowId }});
            return res.status(200).json({
                success: true,
                message: "Utente rimosso dai seguiti"
            })
        }

    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({
            success: false,
            error: error.message || error
        });
    }
}

/**
 * Get all the followers of the active user
 * @returns {Object} Json response with the object which contains
 * the username, profilePicture and description
 * of all the user followers
 */
exports.getMyFollowers = async (req, res) => {
    try {
        const {userId} = req.user;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utente non trovato"
            })
        }

        const followersData = await User.find({
            _id: { $in: user.followers }
        }).select('username profilePicture desc');

        return res.status(200).json({
            success: true,
            count: followersData.length,
            results: followersData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message || error
        });
    }
}
