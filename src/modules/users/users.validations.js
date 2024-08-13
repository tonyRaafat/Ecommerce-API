import Joi from 'joi';

export const registerValidation = Joi.object({
  name: Joi.string()
      .min(3)
      .max(15)
      .trim()
      .required()
      .messages({
          'string.base': `"name" should be a type of 'text'`,
          'string.empty': `"name" cannot be an empty field`,
          'string.min': `"name" should have a minimum length of {#limit}`,
          'string.max': `"name" should have a maximum length of {#limit}`,
          'any.required': `"name" is a required field`
      }),

  email: Joi.string()
      .email()
      .lowercase()
      .required()
      .messages({
          'string.email': `"email" must be a valid email address`,
          'string.empty': `"email" cannot be an empty field`,
          'any.required': `"email" is a required field`
      }),

  password: Joi.string()
      .trim()
      .required()
      .messages({
          'string.base': `"password" should be a type of 'text'`,
          'string.empty': `"password" cannot be an empty field`,
          'any.required': `"password" is a required field`
      }),

  age: Joi.number()
      .required()
      .messages({
          'number.base': `"age" should be a type of 'number'`,
          'number.empty': `"age" cannot be an empty field`,
          'any.required': `"age" is a required field`
      }),

  address: Joi.array().items(Joi.string()),

  phone: Joi.string()
      .optional()
      .messages({
          'string.base': `"phone" should be a type of 'text'`
      }),

  role: Joi.string()
      .valid('User', 'Admin')
      .required()
      .messages({
          'any.only': `"role" must be one of ['User', 'Admin']`,
          'any.required': `"role" is a required field`
      }),
});

export const otpValidation = Joi.object({
  userId: Joi.string().hex().required(),
  otpCode: Joi.string().length(5).required()
})

export const loginValidation = Joi.object({
  email: Joi.string().email(),
  mobileNumber: Joi.string().pattern(/^01[0125][0-9]{8}$/),
  password: Joi.string().required(),
}).xor('email', 'mobileNumber')

export const updateUservalidation = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  recoveryEmail: Joi.string().email().optional(),
  DOB: Joi.date().iso().optional().custom((value, helpers) => {
    const date = new Date(value);
    if (
      date > Date.now()
    ) {
      return helpers.message("you can't be born in the future!!");
    }
    return value;
  }, 'DOB validation'),
  mobileNumber: Joi.string().pattern(/^01[0125][0-9]{8}$/).optional(),
  role: Joi.string().valid('User', 'Company_HR').optional(),
}).unknown(false).min(1);

export const updatePasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
});

export const forgotPasswordValidation = Joi.object({
  email:Joi.string().email().required()
})

export const resetPasswordValidation = Joi.object({
  email:Joi.string().email().required(),
  otpCode: Joi.string().length(5).required(),
  password: Joi.string().required(),
})