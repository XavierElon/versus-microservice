import * as Joi from 'joi'

/* PHONE NUMBER VALIDATION*/
export const validatePhone = (value: string): boolean => {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return regex.test(value);
}

/*
PASSWORD VALIDATION
- contains at least 8 characters
- contains at least one letter
- contains at least one number
- contains at least one special character (@$!%*#?&)
*/
export const validatePassword = (value: string): boolean => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(value);
}

/*
EMAIL VALIDATION
- starts with an alphanumeric character or one of the following special characters: . ! # $ % & ' * + / = ? ^ _ ` { | } ~ -
- contains an @ symbol
- has a domain name with one or more dots (.)
- contains only lowercase and uppercase letters, numbers, dots, hyphens, and/or underscores
*/
export const validateEmail = (value: string): boolean => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(value);
}

/*
USERNAME VALIADTION
The regular expression used in the usernameRegex variable checks for a string that contains only 
letters (uppercase or lowercase) and numbers. 
Additionally, the length of the username must be between 3 and 20 characters.
*/
export const validateUsername = (value: string): boolean => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(value);
}

/*
NAME VALIDATION (FIRSTNAME OR LASTNAME)
 The regular expression used in the nameRegex variable checks 
for a string that contains only letters
(uppercase or lowercase). Additionally, the length of the name must be between 2 and 30 characters.
*/
export const validateName = (value: string): boolean => {
  const regex = /^[a-zA-Z0-9_]{2,20}$/;
  return regex.test(value);
}
