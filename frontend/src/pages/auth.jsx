import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/authContext';
import { validateUser, USERS } from '../constants/users';
import { useToast } from '../hooks/use-toast.js';

const Auth = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return 'Email is required';
    }
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 3) {
      return 'Password should be at least 3 characters long';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError || passwordValidationError) {
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      return;
    }

    setEmailError('');
    setPasswordError('');

    if (isNewUser) {
      const existingUser = USERS.find((user) => user.email === email);
      if (existingUser) {
        toast({
          title: 'Account Exists',
          description: 'An account with this email already exists. Please sign in instead.',
          variant: 'destructive',
        });
        setIsNewUser(false);
        return;
      }

      const newUser = { email, password, role };
      await signUp(newUser);

      toast({
        title: 'Account Created',
        description: `Welcome aboard! You are signed in as ${role}.`,
      });
      navigate('/');
      return;
    }

    const user = validateUser(email, password);

    if (user) {
      signIn(user);
      toast({
        title: 'Success',
        description: `Welcome back! You are signed in as ${user.role}.`,
      });
      navigate('/');
    } else {
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">{isNewUser ? 'Sign Up' : 'Sign In'}</h1>
          <p className="mt-2 text-muted-foreground">
            {isNewUser ? 'Create your account' : 'Welcome back to Prime Shop'}
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            type="button"
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              !isNewUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-foreground hover:bg-muted'
            }`}
            onClick={() => setIsNewUser(false)}
          >
            Existing User
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isNewUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-foreground hover:bg-muted'
            }`}
            onClick={() => setIsNewUser(true)}
          >
            New User
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError('');
                }}
                placeholder="Enter your email"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {emailError && <p className="mt-1 text-sm text-destructive">{emailError}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError('');
                }}
                placeholder="Enter your password"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {passwordError && <p className="mt-1 text-sm text-destructive">{passwordError}</p>}
            </div>

            {isNewUser && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-foreground">
                  Select Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="customer">Customer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isNewUser ? 'Sign Up' : 'Sign In'}
          </button>

          {!isNewUser && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground text-center">
                Demo Accounts:
                <br />
                Manager: manager@gmail.com / 123
                <br />
                Customer: customer@gmail.com / 123
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;

