import { plainToClass, classToPlain } from 'class-transformer';

class User {
  id: number;
  name: string;
  email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

const userData = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};


// Transform plain object to User class instance
const user = plainToClass(User, userData);
console.log(user instanceof User); // Output: true
console.log(user.id); // Output: 1
console.log(user.name); // Output: John Doe
console.log(user.email); // Output: john@example.com


function test() {
  debugger
  const test = plainToClass(Upgrade, upgradeList[0]);
}
test()
/* // Transform User class instance to plain object
const plainUser = classToPlain(user);
console.log(plainUser); // Output: { id: 1, name: 'John Doe', email: 'john@example.com' } */