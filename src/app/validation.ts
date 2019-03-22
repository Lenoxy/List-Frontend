export class Validation {

  validateEmail(email: String): boolean {
    if (email == null) {
      return false;
    } else {
      email = email.trim().toLowerCase();
      if (email.includes('@')) {
        return (email.includes('.'));
      } else {
        return false;
      }
    }

  }

  validateUsername(username: String): boolean {
    if (username == null) {
      return false;
    } else {
      return username.length >= 3;
    }
  }

  validatePassword(password: String, repeatPassword?: String) {
    if (password == null) {
      return false;
    } else {
      if (repeatPassword == null) {
        return (password.length >= 6);
      } else {
        return (password.length >= 6) && (password === repeatPassword);
      }
    }
  }


}
