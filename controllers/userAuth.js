const router = require("express").Router();
const { User} = require("../models/user");
const Token = require("../models/token");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");

const auth = async (req, res) => {
    try {
        //console.log(req.body)
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).send({ message: "Invalid Email or Password" });
       //  console.log(user);
         
          if (user.password === req.body.password) {
            
        } else {
          //  console.log(2);
			return res.status(401).send({ message: "Invalid Email or Password" });
        }
    		
       
        res.status(200).send({
           
            userName: user.fullName,
            userId: user._id.toString(),
            message: "logged in successfully"
        });
        
    } catch (error) {
        console.error(error);  
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};


const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};
const userPic = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.profilePhoto || !user.profilePhoto.url) {
            return res.status(404).send('Image not found');
        }

        // Redirect to the Cloudinary URL
        res.redirect(user.profilePhoto.url);
    } catch (error) {
        console.error("Error fetching user photo:", error);
        res.status(500).send("Internal server error");
    }
};



module.exports = {
	auth,
	userPic
  };

