import bcrypt from "bcryptjs";
import crypto from "crypto"
import User from "../models/users.js";
import fs from "fs"

// Function to encrypt data with public key
function encryptData(data) {
    const publicKey = fs.readFileSync('public.key');
  const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(data));
  return encryptedData.toString('base64');
}


export const signup = async (req, res) => {
    
    const { email, mobileNumber, fullName, password } = req.body;
    // Generate a fixed salt value
    
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
   
    const encryptedMobileNumber = encryptData(mobileNumber);
    const encryptedFullName = encryptData(fullName);
    
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
        email: email,
        mobileNumber: encryptedMobileNumber,
        fullName: encryptedFullName,
        password: hashedPassword,
    });

    try {
        // Save user to the database
        const savedUser = await user.save();
        return res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
};

export const resetpassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
 
    const salt = await bcrypt.genSalt(16);
    const user = await User.findOne({ email: email });
    
    if (!user) return res.status(400).send('Invalid email or password');
    
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

   
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    const salt = await bcrypt.genSalt(16);
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
};

export const updatedetails = async (req, res) => {
    const { email, newEmail, newMobileNumber, newFullName } = req.body;
    
    const salt = await bcrypt.genSalt(16);
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send('Invalid email');

    if (newEmail) user.email = newEmail;
    if (newMobileNumber) user.mobileNumber = encryptData(newMobileNumber);
    if (newFullName) user.fullName = encryptData(newFullName);

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400).send(error);
    }
};
