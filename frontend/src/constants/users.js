export const USERS = [
  {
    email: 'manager@gmail.com',
    password: '123',
    role: 'manager'
  },
  {
    email: 'customer@gmail.com',
    password: '123',
    role: 'customer'
  }
];

export const validateUser = (email, password) => {
  const user = USERS.find(u => u.email === email && u.password === password);
  return user || null;
};
