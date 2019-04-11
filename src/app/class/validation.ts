export class Validation {

  validateEmail(email: String): boolean {
    if (email == null) {
      return false;
    } else {

      email.trim().toLowerCase();
      try {
        //splittedat takes a Email adress and splits for example user@provider.org into "user" and "provider.org".
        let splittedat: String[] = email.split('@');
        //splitteddot takes the output of the first splitter "provider.org" and splits it into "provider" and "org".
        let splitteddot: String[] = splittedat[1].split('.');
        //Checking if these texts aren't too long

        return splittedat[0].length >= 2 && splitteddot[0].length >= 2 && splitteddot[1].length >= 2;

      } catch {
        return false;
      }
    }

  }

  validateUsername(username: String): boolean {
    if (!username) {
      return false;
    } else {
      return username.length >= 3;
    }
  }

  validatePassword(password: String): boolean {
    if (!password) {
      return false;
    } else if (password.length >= 6) {
      return true;
    } else {
      return false;
    }
  }

  validateRepeatPassword(password: string, repeatPassword): boolean {
    if (!password && !repeatPassword) {
      return false;
    } else {
      return password === repeatPassword;
    }
  }
}
