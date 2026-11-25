   import { useState } from 'react';
import { ArrowRight, Check, Flower2 } from 'lucide-react';
import { Link } from 'wouter';
  import { useForm } from 'react-hook-form';
import type { UserProfile } from '../../types';

  type AccountFormValues = {
    name: string;
    email: string;
    password: string;
  };

type AccountFormProps = {
  mode: 'login' | 'signup';
  onAuthenticated: (profile: UserProfile) => void;
};

export function AccountForm({ mode, onAuthenticated }: AccountFormProps) {
  const isSignUp = mode === 'signup';
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<AccountFormValues>({
    defaultValues: { name: '', email: '', password: '' },
  });

  function submitAccount(values: AccountFormValues) {
    const email = values.email.trim();
    const enteredName = values.name.trim();

    onAuthenticated({
      name: enteredName || email.split('@')[0],
      email,
      phone: '',
    });

    // Login is simulated; credentials are not validated or stored.
    setMessage(
      isSignUp
        ? 'Thanks for signing up! Account creation is a demo for now.'
        : 'You’re signed in for this demo. Your profile stays in memory until you refresh.',
    );
  }

  return (
    <main className="account-access wrap page-in">
      <section className="account-card card">
        <div className="account-brand-mark"><Flower2 size={22} /></div>
        <p className="eyebrow">A LITTLE SPACE FOR YOU</p>
        <h1 className="serif">{isSignUp ? 'Join Mysa House.' : 'Welcome back.'}</h1>
        <p className="account-intro">
          {isSignUp
            ? 'Create a demo account to make your visits feel more personal.'
            : 'Sign in to continue to your Mysa House demo account.'}
        </p>

        <form className="account-form" onSubmit={handleSubmit(submitAccount)}>
          {isSignUp && (
            <div className="form-row">
              <label className="label" htmlFor="account-name">Your name</label>
              <input className="field" id="account-name" autoComplete="name" placeholder="First and last name" {...register('name', { required: 'Please enter your name.' })} />
              {errors.name && <small className="availability-error" role="alert">{errors.name.message}</small>}
            </div>
          )}
          <div className="form-row">
            <label className="label" htmlFor="account-email">Email address</label>
            <input className="field" id="account-email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email', {
              required: 'Please enter your email address.',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
            })} />
            {errors.email && <small className="availability-error" role="alert">{errors.email.message}</small>}
          </div>
          <div className="form-row">
            <label className="label" htmlFor="account-password">Password</label>
            <input className="field" id="account-password" type="password" autoComplete={isSignUp ? 'new-password' : 'current-password'} placeholder={isSignUp ? 'At least 8 characters' : 'Your password'} {...register('password', {
              required: 'Please enter your password.',
              minLength: isSignUp ? { value: 8, message: 'Use at least 8 characters.' } : undefined,
            })} />
            {errors.password && <small className="availability-error" role="alert">{errors.password.message}</small>}
          </div>
          <button className="btn account-submit" type="submit">
            {isSignUp ? 'Create demo account' : 'Sign in'} <ArrowRight size={16} />
          </button>
        </form>

        {message && <p className="account-notice" role="status"><Check size={17} />{message}</p>}
        <p className="account-switch">
          {isSignUp ? 'Already have an account?' : 'New to Mysa House?'}{' '}
          <Link href={isSignUp ? '/login' : '/signup'}>{isSignUp ? 'Sign in' : 'Create an account'}</Link>
        </p>
        <p className="account-demo-note">Demo page only: passwords are not sent, checked, or stored.</p>
      </section>
    </main>
  );
}