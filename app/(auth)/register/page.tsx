'use client';

import { useActionState } from 'react';
import { register } from '@/actions/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    register,
    undefined,
  );

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-[#151515] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Join to add your own venues and programs</p>
        </div>
        
        <form action={dispatch} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="hello@example.com"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
            <p className="text-xs text-gray-400 ml-1 mt-1">Must be at least 6 characters.</p>
          </div>
          
          {errorMessage && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20">
              {errorMessage}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all disabled:opacity-70 shadow-lg shadow-teal-500/30"
          >
            {isPending ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
