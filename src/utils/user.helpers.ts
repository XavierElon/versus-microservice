import { validUser } from '../structures/types'
import {isValidPhoneNumber,
    isValidPassword,isValidEmail,
    isValidUsername,isValidName} from '../utils/verification.helper'
import { userSchema } from '../models/user.model'


/*
SET VALID USER
This function returns a Promise that resolves to an object with the shape of validUser. 
The object contains two properties isValid and errorMessage that correspond to the two arguments passed to the function.
The function is using the shorthand syntax 
for object literals to return an object with 
the properties isValid and errorMessage assigned the values of the respective arguments
*/
const setValidUser = async (isValid:boolean, errorMessage:string): Promise<validUser> => {
    return {isValid,errorMessage};
   };
/*
VALIDATE USER
The function takes one argument User, which is expected to be of type typeof userSchema.
The function is used to validate the properties of the User object and returns a Promise 
that resolves to an object with the shape of validUser.
The function first checks the validity of the User object's properties using a set of 
validation functions such as isValidPhoneNumber, isValidPassword, isValidEmail, isValidUsername, isValidName. 
If any of the properties are invalid, the function returns a call to setValidUser with false as the first argument 
and an error message string as the second argument.
*/
   export const validateUser = async (User: typeof userSchema): Promise<validUser> => {
     
     if(!isValidPhoneNumber(User.mobileNumber)){
       return setValidUser(false, ('Invalid Phone Number'));
     }
   
     if(!isValidPassword(User.password)){
       return setValidUser(false, ('Invalid Password'));
     }
   
     if(!isValidEmail(User.email)){
       return setValidUser(false, ('Invalid Email'));
     }
   
     if(!isValidUsername(User.userName)){
       return setValidUser(false, ('Invalid Username'));
     }
   
     if(!isValidName(User.lastName)){
       return setValidUser(false, ('Invalid Lastname'));
     }
   
     if(!isValidName(User.firstName)){
       return setValidUser(false, ('Invalid Firstname'));
     }
     
     return setValidUser(true, ('Valid User'));
     
   };