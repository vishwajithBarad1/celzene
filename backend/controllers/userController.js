// this file will basically have all the functions with logic specific to users

const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const { sendEmail } = require('../utils/email')

const secretKey = "hello"

// Generate a token
const generateToken = (id, role) => {
    return jwt.sign({ id: id, role: role }, secretKey, {
        expiresIn: '24h'
    })
}

// Creating a new user with a given name and email
exports.createUser = async (req, res) => {
    try {
        const { name, email, role, password } = req.body;

        // user is a mongodb document
        const user = new User({
            name: name,
            email: email,
            role: role,
            password: password
        });
    
        // save this user inside mongodb. We are inserting the user mongodb document inside User mongoDb collectin
        await user.save();
    
        // generate the token for this user who has just been registered on the library management system
        const token = generateToken(user._id, user.role)
    
        res.status(201).json({
            success: true,
            token: token,
            data: user
        })
    } catch (err)   {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // mongoDb operation to find the user
        const user = await User.findOne({ email: email })

        if (user && (await user.matchPassword(password)))   {
            const token = generateToken(user._id, user.role);

            res.json({
                success: true,
                token: token,
                data: user
            })
        }
    } catch (err)   {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// This function gets me all the users present inside the MongoDB collection Users
exports.getAllUsers = async (req, res) => {
    try {
        // for pagination I need page number and limit
        const { page, limit } = req.query

        // transform my operation to show me only the entries on a specific page with its limit

        // within my operation I need to write a condition which returns only the users for whom isDelete: false
        const users = await User.find({ isDeleted: false }).limit(limit).skip((page-1) * limit).exec();
            
        res.status(200).json({
            success: true,
            data: users
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// This function updates a user by its id
exports.updateUserById = async (req, res) => {
    // find a user by its id and update it
    const { id } = req.params
    const { name, email } = req.body

    // error handling

    try { // we write all the usual logic of our code here, assuming everything works fine
        // this is the operation to find and update the user
        const user = await User.findByIdAndUpdate(id, { name: name, email: email })

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (err)   {
        res.status(500).json({
            success: false,
            message: 'error occured'
        })
    }
}

// This function is responsible for soft deleting a user from mongodb
exports.softDeleteById = async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findById(id)

        user.isDeleted = true;
        user.save();

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (err)   {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// This function is responsible for uploading a file from local machine to the server. My file would be coming inside my request.
exports.uploadFile = async (req, res) => {
    try {
        res.status(201).json({  // uploading a file is quivalent to creating a new data inside the server instance
            success: true,
            data: req.file,
            message: 'File uploaded successfully'
        })
    } catch (err)   {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.uploadMultipleFiles = async (req, res) => {
    try {
        if (req.files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No files were uploaded'
            })
        }

        res.status(201).json({  // uploading a file is quivalent to creating a new data inside the server instance
            success: true,
            data: req.file,
            message: 'File uploaded successfully'
        })
    } catch (err)   {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Write an API that returns me the list of all the students in the users collection.
// for student users -> user.role = 'Student' [Filter]
exports.getAllStudents = async (req, res) => {
    try {
        const users = await User.find({ role: 'Student', isDeleted: false });

        res.status(200).json({
            success: true,
            data: users
        })
    } catch (err)   {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        await sendEmail(to, subject, text);

        res.status(200).json({
            success: true,
            message: 'Email sent successfully to ' + to
        })
    } catch (err)   {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}