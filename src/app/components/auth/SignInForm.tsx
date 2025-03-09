"use client";

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Role } from '@/app/types';

const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface SignInFormProps {
  onClose: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession(); // Access the session

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof signInFormSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // Prevent automatic redirection
      });

      setLoading(false);

      if (result?.error) {
        setError(result.error);
      } else {
        // Wait for the session to be available
        const intervalId = setInterval(() => {
          if (session?.user) {
            clearInterval(intervalId);
            // Redirect based on user role
            if (session.user.role === Role.ADMIN || session.user.role === Role.EDITOR) {
              router.push('/admin');
            } else if (session.user.role === Role.CLIENT || session.user.role === Role.PRINTER) {
              router.push('/main');
            } else {
              router.push('/'); // Default redirect
            }
          }
        }, 50); // Check every 50 milliseconds
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register("email")}
            placeholder="Email"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register("password")}
            placeholder="Password"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password?.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
          <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;