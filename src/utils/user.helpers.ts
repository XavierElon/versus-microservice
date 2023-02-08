import { validUser } from '../structures/types'
import {isValidPhoneNumber,
    isValidPassword,isValidEmail,
    isValidUsername,isValidName} from '../utils/verification.helper'
 import { userSchema } from '../models/user.model'


/*
SET VALID USER
This function is used in the validateUser function to set the values of the validUser interface before being returned
*/
const setValidUser = async (isValid:boolean, errorMessage:string): Promise<validUser> => {
  
    const userToReturn: validUser = {isValid: isValid, errorMessage: errorMessage} as validUser;
    return userToReturn;

   };
/*
VALIDATE USER
This function will validate all the new users account information before creating them in the database
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