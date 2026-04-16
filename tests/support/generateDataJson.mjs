import { faker } from '@faker-js/faker';
import { writeFileSync } from 'fs';

const data = {
  userName: faker.internet.userName(),
  password: faker.internet.password(10, true, /[A-Za-z0-9]/, 'a1!A')
};

writeFileSync('tests/support/data.json', JSON.stringify(data, null, 2));
console.log('Generated tests/support/data.json:', data);
