
export class ErrorMessage {
  password: string;
  phone: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  constructor() {
    this.password = 'Password must contain at least 8 characters, at least one letter, at least one number, and at least one special character (@$!%*#?&)';
    this.phone ='Invalid phone number';
    this.email = 'Invalid email';
    this.username = 'Username must contain only letters and numbers, and must be between 3 - 20 characters';
    this.firstname = 'Firstname must contain only letters, and must be between 2 - 30 characters';
    this.lastname = 'Lastname must contain only letters, and must be between 2 - 30 characters';
  }
}
