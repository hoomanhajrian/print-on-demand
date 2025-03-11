"use client";

import { useState, useEffect } from 'react';
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
  const { data: session, status } = useSession(); // Access the session and status

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

    console.log(data);
    

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // Prevent automatic redirection
      });

      setLoading(false);

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Successful sign-in, wait for session
      } else {
        setError("An unknown error occurred during sign-in.");
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Redirect based on user role
      if (session.user.role === Role.ADMIN || session.user.role === Role.EDITOR) {
        router.push('/admin');
      } else if (session.user.role === Role.CLIENT || session.user.role === Role.PRINTER) {
        router.push('/main');
      } else {
        router.push('/'); // Default redirect
      }
    } else if (status === "unauthenticated" && loading === false){
      // if the user is unauthenticated after loading is false, then there was an issue with sign in.
      // the error should be displayed above the form.
    }
  }, [status, session, router, loading]);

  return (
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
  );
};

export default SignInForm;