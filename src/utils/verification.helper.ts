import * as Joi from 'joi'

/* PHONE NUMBER VALIDATION*/
export const validatePhone = (value: string): boolean => {
  const phoneValidation = Joi.string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    .validate(value)
  return phoneValidation.error === null
}

/*
PASSWORD VALIDATION
- contains at least 8 characters
- contains at least one letter
- contains at least one number
- contains at least one special character (@$!%*#?&)
*/
export const validatePassword = (value: string): boolean => {
  const passwordValidation = Joi.string()
    .regex(/^(?=.[A-Za-z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .validate(value)
  return passwordValidation.error === null
}

/*
EMAIL VALIDATION
- starts with an alphanumeric character or one of the following special characters: . ! # $ % & ' * + / = ? ^ _ ` { | } ~ -
- contains an @ symbol
- has a domain name with one or more dots (.)
- contains only lowercase and uppercase letters, numbers, dots, hyphens, and/or underscores
*/
export const validateEmail = (value: string): boolean => {
  const emailValidation = Joi.string()
    .regex(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    )
    .validate(value)
  return emailValidation.error === null
}

/*
USERNAME VALIADTION
The regular expression used in the usernameRegex variable checks for a string that contains only 
letters (uppercase or lowercase) and numbers. 
Additionally, the length of the username must be between 3 and 20 characters.
*/
export const validateUsername = (value: string): boolean => {
  const userNameValidation = Joi.string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/)
    .validate(value)
  return userNameValidation.error === null
}

/*
NAME VALIDATION (FIRSTNAME OR LASTNAME)
 The regular expression used in the nameRegex variable checks 
for a string that contains only letters
(uppercase or lowercase). Additionally, the length of the name must be between 2 and 30 characters.
*/
export const validateName = (value: string): boolean => {
  const nameValidation = Joi.string()
    .min(2)
    .max(30)
    .regex(/^[a-zA-Z]+$/)
    .validate(value)
  return nameValidation === null
}
