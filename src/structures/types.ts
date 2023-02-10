
export class ErrorMessage {
  password: string;
  mobileNumber: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  constructor() {
    this.password = 'Password must contain at least 8 characters, at least one letter, at least one number, and at least one special character (@$!%*#?&)';
    this.mobileNumber ='Invalid phone number';
    this.email = 'Invalid email';
    this.userName = 'Username must contain only letters and numbers, and must be between 3 - 20 characters';
    this.firstName = 'Firstname must contain only letters, and must be between 2 - 30 characters';
    this.lastName = 'Lastname must contain only letters, and must be between 2 - 30 characters';
  }
}
