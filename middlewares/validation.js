const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Fix the custom Joi extension - use a different name to avoid conflicts
const customJoi = Joi.extend((joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.validUrl": "{{#label}} must be a valid URL",
  },
  rules: {
    validUrl: {
      // Changed from 'uri' to 'validUrl' to avoid conflict
      validate(value, helpers) {
        if (
          !validator.isURL(value, {
            protocols: ["http", "https"],
            require_protocol: true,
          })
        ) {
          return helpers.error("string.validUrl");
        }
        return value;
      },
    },
  },
}));

// User validation schemas
const validateUserSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be no more than 30 characters long",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    avatar: customJoi.string().validUrl().optional().messages({
      // Changed to .validUrl()
      "string.validUrl": "Avatar must be a valid URL",
    }),
  }),
});

const validateUserSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).optional().messages({
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name must be no more than 30 characters long",
      }),
      avatar: customJoi.string().validUrl().optional().messages({
        // Changed to .validUrl()
        "string.validUrl": "Avatar must be a valid URL",
      }),
    })
    .min(1)
    .messages({
      "object.min": "At least one field (name or avatar) must be provided",
    }),
});

// Clothing item validation schemas
const validateItemCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Item name must be at least 2 characters long",
      "string.max": "Item name must be no more than 30 characters long",
      "any.required": "Item name is required",
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "any.only": "Weather must be one of: hot, warm, cold",
      "any.required": "Weather type is required",
    }),
    imageUrl: customJoi.string().validUrl().required().messages({
      // Changed to .validUrl()
      "string.validUrl": "Image URL must be a valid URL",
      "any.required": "Image URL is required",
    }),
  }),
});

// Alternative approach: Use built-in Joi.string().uri() instead of custom validation
const validateUserSignupAlternative = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .optional(), // Built-in URI validation
  }),
});

const validateUserUpdateAlternative = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).optional(),
      avatar: Joi.string()
        .uri({ scheme: ["http", "https"] })
        .optional(), // Built-in URI validation
    })
    .min(1),
});

const validateItemCreationAlternative = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .required(), // Built-in URI validation
  }),
});

// Keep your existing parameter and query validations as they are
const validateObjectId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Item ID must be a valid MongoDB ObjectId",
        "any.required": "Item ID is required",
      }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "User ID must be a valid MongoDB ObjectId",
        "any.required": "User ID is required",
      }),
  }),
});

module.exports = {
  // Use either the custom validation or the alternative built-in validation
  validateUserSignup: validateUserSignupAlternative, // Using built-in URI validation
  validateUserSignin,
  validateUserUpdate: validateUserUpdateAlternative, // Using built-in URI validation
  validateItemCreation: validateItemCreationAlternative, // Using built-in URI validation
  validateObjectId,
  validateUserId,

  // Export both versions so you can choose
  validateUserSignupCustom: validateUserSignup,
  validateUserUpdateCustom: validateUserUpdate,
  validateItemCreationCustom: validateItemCreation,
};
