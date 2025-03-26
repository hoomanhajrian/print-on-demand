"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import * as z from "zod";

const profileUpdateSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    profileImage: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const ProfileUpdateForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [session, updateSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  console.log("Seeeeeeeeeesion", session);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
  });

  const onSubmit = async (data: z.infer<typeof profileUpdateSchema>) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", data.email);
    if (data.password && data.confirmPassword) {
      formData.append("password", data.password);
    }
    if (data.profileImage) {
      formData.append("profileImage", data.profileImage);
    }

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setLoading(false);
        setSuccess("Profile updated successfully");
        setTimeout(() => {
          router.push("/main");
        }, 2000);
      } else {
        setError(result.error || "An unknown error occurred");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An unexpected error occurred");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setError("File size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setValue("profileImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const session = await getSession();
      updateSession(session);
    };
    getUser();
    return () => {
      updateSession(null);
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Update Profile
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label={session?.user?.email}
              variant="outlined"
              fullWidth
              disabled
              {...register("email")}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Button variant="contained" component="label">
              Upload Profile Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Box>
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Avatar
              src={previewImage || session?.user?.image || ""}
              alt="Profile Image"
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Box>
          <Button
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Update Profile
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ProfileUpdateForm;
