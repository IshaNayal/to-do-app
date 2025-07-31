-- Migration to update test user email from test@example.com to ishanayal16@gmail.com
UPDATE users 
SET email = 'ishanayal16@gmail.com' 
WHERE email = 'test@example.com';
