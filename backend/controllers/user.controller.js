import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Application } from "../models/application.model.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role, birth_year } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role || !birth_year) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Password length validation (minimum 8 characters)
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long.",
                success: false
            });
        }

        if (phoneNumber.toString().length !== 10) {
            return res.status(400).json({
                message: "Phone number must be exactly 10 digits.",
                success: false
            });
        }
        

        const birthDate = new Date(birth_year);
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthDate.getFullYear();

        // Role-based age validation
        if (role === 'Seeker' && (age < 16 || age > 80)) {
            return res.status(400).json({
                message: "Seeker's age must be between 16 and 80 years.",
                success: false
            });
        }

        if (role === 'Recruiter' && (age < 18 || age > 80)) {
            return res.status(400).json({
                message: "Recruiter's age must be between 18 and 80 years.",
                success: false
            });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "File is missing",
                success: false
            });
        }

        const fileUri = getDataUri(file);
        let cloudResponse;
        try {
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        } catch (uploadError) {
            return res.status(500).json({
                message: "Error uploading file to Cloudinary",
                error: uploadError.message,
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            birth_year: birthDate,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error details:", error);
        return res.status(500).json({
            message: "An error occurred while registering the user",
            error: error.message,
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            birth_year: user.birth_year,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retriving the user",
            error: error.message,
            success: false
        });
    }
};


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while logging out the user",
            error: error.message,
            success: false
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file; 
        
        let fileUri = "";
        let cloudResponse = null;
        if (file) {
            fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            console.log(cloudResponse);
        }

        let skillsArray = [];
        if (skills) {
            skillsArray = skills.split(",").map(skill => skill.trim()); // Trim spaces
        }
        
        const userId = req.id; // Middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

         // Check if the email is already registered by another user
         if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email is already registered.",
                    success: false
                });
            }
        }

        if (phoneNumber.toString().length !== 10) {
            return res.status(400).json({
                message: "Phone number must be exactly 10 digits.",
                success: false
            });
        }
        
        // Update user fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // Update resume if file is uploaded
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // Save the Cloudinary URL
            user.profile.resumeOriginalName = file.originalname; // Save the original file name
        }

        await user.save();

        // Return updated user info
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            birth_year: user.birth_year,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the user",
            error: error.message,
            success: false
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Delete the user's profile photo from Cloudinary if it exists
        if (user.profile && user.profile.profilePhoto) {
            const publicId = user.profile.profilePhoto.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Delete the user's applications
        await Application.deleteMany({ applicant: user._id });

        // Delete the user from the database
        await user.deleteOne();

        return res.status(200).json({
            message: "User and associated applications deleted successfully.",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting the user",
            error: error.message,
            success: false
        });
    }
};
