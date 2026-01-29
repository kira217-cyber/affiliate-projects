const Joi = require("joi");
const user_model = require("../../model/user.model");
const WithdrawPaymentTransaction = require("../../model/WithdrawPaymentTransaction");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getPlayerId } = require("../../utils/getPlayerId");
const sendResponse = require("../../utils/responseHandler");
const User = require("../../model/user.model");

// Validation schemas
const signupSchema = Joi.object({
  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9+\-\(\) ]{8,15}$/)
    .message("Invalid phone number format"),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  name: Joi.string().allow("", null).optional(),
 // email: Joi.string().email().allow(null).optional(),
  country: Joi.string().allow(null).optional(),
  currency: Joi.string().allow(null).optional(),
});

const loginSchema = Joi.object({
  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9+\-\(\) ]{8,15}$/)
    .message("Invalid phone number format"),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

exports.signupUserFrontend = async (req, res) => {
  try {

    console.log("this is inside signupUserFrontend ",req.body);
    

    // Validate request body
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    const { phoneNumber, password, name, country, currency } = req.body;

    // Check if phoneNumber already exists
    const existingUser = await user_model.findOne({ phoneNumber });
    if (existingUser) {
      return sendResponse(
        res,
        409,
        false,
        "Phone number already exists, please try another one"
      );
    }

    // Check if email exists (if provided)
    // if (email) {
    //   const existingEmail = await user_model.findOne({ email });
    //   if (existingEmail) {
    //     return sendResponse(
    //       res,
    //       409,
    //       false,
    //       "Email already exists, please try another one"
    //     );
    //   }
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new user_model({
      phoneNumber,
      password: hashedPassword,
      name,
     // email,
      country,
      currency,
      player_id: getPlayerId(),
    });

    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role, phoneNumber: savedUser.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare user response (exclude sensitive fields)
    const userResponse = {
      ...savedUser.toObject(),
      password: undefined,
      emailVerifyOTP: undefined,
      phoneNumberOTP: undefined,
    };

    sendResponse(res, 201, true, "User created successfully", {
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    if (error.message.includes("phoneNumber already exists")) {
      return sendResponse(res, 409, false, "Phone number already exists");
    }
    // if (error.message.includes("email already exists")) {
    //   return sendResponse(res, 409, false, "Email already exists");
    // }
    sendResponse(res, 500, false, "Internal server error");
  }
};

exports.loginUserFrontend = async (req, res) => {
  try {
    // Validate request body
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    const { phoneNumber, password } = req.body;

    // Find user by phoneNumber
    const user = await user_model.findOne({ phoneNumber });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid password");
    }

    // Check user status
    if (user.status === "banned") {
      return sendResponse(
        res,
        403,
        false,
        "Your account has been banned, please contact the admin"
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare user response
    const userResponse = {
      ...user.toObject(),
      password: undefined,
      emailVerifyOTP: undefined,
      phoneNumberOTP: undefined,
    };

    sendResponse(res, 200, true, "User logged in successfully", {
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login Error:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};

exports.checkTokenFrontend = async (req, res) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return sendResponse(res, 401, false, "Token not found");
    }
    token = token.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return sendResponse(res, 401, false, "Invalid token");
    }

    // Find user
    const user = await user_model
      .findById(decoded.id)
      .select("-password -emailVerifyOTP -phoneNumberOTP");
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Check user status
    if (user.status === "banned") {
      return sendResponse(
        res,
        403,
        false,
        "Your account has been banned, please contact the admin"
      );
    }

    // Generate new token
    token = jwt.sign(
      { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    sendResponse(res, 200, true, "Token verified successfully", {
      token,
      user: user.toObject(),
    });
  } catch (error) {
    console.error("Check Token Error:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};

exports.updateBirthdayFrontend = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { birthday } = req.body;

    if (!birthday) {
      return sendResponse(res, 400, false, "Birthday is required");
    }

    const user = await user_model
      .findById(userId)
      .select("-password -emailVerifyOTP -phoneNumberOTP");
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    user.birthday = birthday;
    await user.save();

    sendResponse(res, 200, true, "Birthday updated successfully", user);
  } catch (error) {
    console.error("Update Birthday Error:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};

exports.sendEmailVerificationFrontend = async (req, res) => {
  try {
    const { _id: userId, email } = req.body;
    if (!email) {
      return sendResponse(res, 400, false, "Email is required");
    }

    const user = await user_model.findById(userId).select("-password");
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    const emailVerifyOtp = Math.floor(1000 + Math.random() * 9000);
    user.emailVerifyOTP = emailVerifyOtp;
    user.email = email;
    await user.save();

    // TODO: Implement sendEmail function
    // await sendEmail(email, "Verify your email", `Your OTP is: ${emailVerifyOtp}`);

    sendResponse(res, 200, true, "Please check your email to get your OTP", {
      ...user.toObject(),
      emailVerifyOTP: undefined,
      password: undefined,
    });
  } catch (error) {
    console.error("Send Email Verification Error:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};

exports.checkEmailVerificationFrontend = async (req, res) => {
  try {
    const { _id: userId, email, otp: userOtp } = req.body;
    if (!email || !userOtp) {
      return sendResponse(res, 400, false, "Email and OTP are required");
    }

    const user = await user_model.findById(userId).select("-password");
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (user.emailVerifyOTP == userOtp) {
      user.emailVerified = true;
      user.emailVerifyOTP = 0;
      await user.save();
      return sendResponse(
        res,
        200,
        true,
        "Email verified successfully",
        { ...user.toObject(), emailVerifyOTP: undefined, password: undefined }
      );
    }

    sendResponse(res, 401, false, "Invalid OTP", {
      ...user.toObject(),
      emailVerifyOTP: undefined,
      password: undefined,
    });
  } catch (error) {
    console.error("Check Email Verification Error:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};

exports.sendPhoneVerificationFrontend = async (req, res) => {
  try {
    const { _id: userId, phoneNumber } = req.body;
    if (!phoneNumber) {
      return sendResponse(res, 400, false, "Phone number is required");
    }

    const user = await user_model.findById(userId).select("-password");
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    const phoneVerifyOtp = Math.floor(1000 + Math.random() * 9000);
    user.phoneNumberOTP = phoneVerifyOtp;
    user.phoneNumber = phoneNumber;
    await user.save();

    // TODO: Implement sendSms function
    // await sendSms(phoneNumber, `Your OTP is: ${phoneVerifyOtp}`);

    sendResponse(res, 200, true, "Please check your phone to get your OTP", {
      ...user.toObject(),
      phoneNumberOTP: undefined,
      password: undefined,
    });
  } catch (error) {
    console.error("Send Phone Verification Error:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};

exports.checkPhoneVerificationFrontend = async (req, res) => {
  try {
    const { _id: userId, phoneNumber, otp: userOtp } = req.body;
    if (!phoneNumber || !userOtp) {
      return sendResponse(res, 400, false, "Phone number and OTP are required");
    }

    const user = await user_model.findById(userId).select("-password");
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (user.phoneNumberOTP == userOtp) {
      user.phoneNumberVerified = true;
      user.phoneNumberOTP = 0;
      await user.save();
      return sendResponse(
        res,
        200,
        true,
        "Phone verified successfully",
        { ...user.toObject(), phoneNumberOTP: undefined, password: undefined }
      );
    }

    sendResponse(res, 401, false, "Invalid OTP", {
      ...user.toObject(),
      phoneNumberOTP: undefined,
      password: undefined,
    });
  } catch (error) {
    console.error("Check Phone Verification Error:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};

exports.getBalance = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await user_model.findById(userId);
    const pendingWithdraws = await WithdrawPaymentTransaction.find({
      userId,
      status: "pending",
    }).lean();
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    const totalPendingWithdraw = pendingWithdraws.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    const balance = user.balance - totalPendingWithdraw;
    sendResponse(res, 200, true, "User balance", balance);
  } catch (error) {
    console.error("Get Balance Error:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};

exports.changePasswordFrontend = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return sendResponse(res, 401, false, "Token not provided");
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return sendResponse(res, 401, false, "Invalid token");
    }

    // Find user by ID
    const user = await user_model.findById(decoded.id);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Incorrect old password");
    }

    // Validate new password
    if (newPassword.length < 6) {
      return sendResponse(
        res,
        400,
        false,
        "New password must be at least 6 characters long"
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    sendResponse(res, 200, true, "Password changed successfully");
  } catch (error) {
    console.error("Change Password Error:", error);
    sendResponse(res, 500, false, "Internal server error");
  }
};


exports.updateUsernameFrontend = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};