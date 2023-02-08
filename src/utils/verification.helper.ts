
/* PHONE NUMBER VALIDATION*/
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return phoneRegex.test(phoneNumber);
}


/*
PASSWORD VALIDATION
- contains at least 8 characters
- contains at least one letter
- contains at least one number
- contains at least one special character (@$!%*#?&)
*/
export const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
}

/*
EMAIL VALIDATION
- starts with an alphanumeric character or one of the following special characters: . ! # $ % & ' * + / = ? ^ _ ` { | } ~ -
- contains an @ symbol
- has a domain name with one or more dots (.)
- contains only lowercase and uppercase letters, numbers, dots, hyphens, and/or underscores
*/
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
};

/*
USERNAME VALIADTION
The regular expression used in the usernameRegex variable checks for a string that contains only 
letters (uppercase or lowercase) and numbers. 
Additionally, the length of the username must be between 3 and 20 characters.
*/
export const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username) && username.length >= 3 && username.length <= 20;
  };


/*
NAME VALIDATION (FIRSTNAME OR LASTNAME)
 The regular expression used in the nameRegex variable checks 
for a string that contains only letters
(uppercase or lowercase). Additionally, the length of the name must be between 2 and 30 characters.
*/
 export const isValidName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name) && name.length >= 2 && name.length <= 30;
};


  