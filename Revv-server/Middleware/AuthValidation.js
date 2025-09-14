const Joi = require("joi");

// ✅ Signup validation
const signupValidation = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    phno: Joi.string().required(),
    address: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};



// ✅ Login validation
const loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(4).max(100).required().messages({
      'string.min': 'Password must be at least 4 characters long',
      'any.required': 'Password is required'
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    console.log("Validation error:", error.details);
    return res.status(400).json({ 
      message: "Validation failed",
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// ✅ Export both properly
module.exports = {
  signupValidation,
  loginValidation,
};
