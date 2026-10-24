import { faker } from '@faker-js/faker';
import { writeFileSync } from 'fs';

const data = {
  userName: faker.internet.username(),
  password: faker.internet.password({ length: 10, memorable: true, pattern: /[A-Za-z0-9]/, prefix: 'a1!A' })
};

writeFileSync('tests/support/data.json', JSON.stringify(data, null, 2));
console.log('Generated tests/support/data.json:', data);
