export class InstantValidation {

  public validateUsername(username: string): boolean {
    if (username) {
      return username.length >= 3;
    } else {
      return false;
    }
  }

  public validateEmail(email: string) {
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

  public validatePassword(password: string) {
    if (password === null) {
      return false;
    } else {
      return password.length >= 6;
    }
  }

  public validateRepeatPassword(password: string, repeatPassword: string) {
    if (password && repeatPassword) {
      return password === repeatPassword;
    } else {
      return false;
    }
  }
}
