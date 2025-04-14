"use client";
import { FC, useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { useDispatch } from "react-redux";
import * as z from "zod";
import { showAlert } from "@/app/features/alert/alertSlice";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const profileUpdateSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().email("Invalid email address"),
    profileImage: z.string().optional(),
    password: z
      .string()
      .optional()
      .nullable()
      .refine((value) => !value || value.length >= 8, {
        message: "Password must be at least 8 characters",
      })
      .refine((value) => !value || value.length <= 20, {
        message: "Password must be at most 20 characters",
      }),
    confirmPassword: z
      .string()
      .optional()
      .nullable()
      .refine((value) => !value || value.length >= 8, {
        message: "Confirm Password must be at least 8 characters",
      })
      .refine((value) => !value || value.length <= 20, {
        message: "Confirm Password must be at most 20 characters",
      }),
  })
  .refine(
    (data) => {
      // Only validate confirmPassword if password is provided
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

const ProfileUpdateForm: FC = () => {
  // states
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [session, updateSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>({}); // Store initial form values

  // define hooks
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
  });

  const onSubmit = async (data: z.infer<typeof profileUpdateSchema>) => {
    setLoading(true);

    const formData = new FormData();
    setLoading(true);

    // Log the form data
    console.log("Form data:", data);

    formData.append("email", data.email);
    if (data.password && data.confirmPassword) {
      formData.append("password", data.password);
    }
    if (data.profileImage) {
      formData.append("profileImage", data.profileImage);
    }

    try {
      profileUpdateSchema.parse(data); // Validate the data with Zod

      const response = await fetch("/api/users", {
        method: "PUT",
        body: formData,
      });

      const result: { message?: string; error?: string } =
        await response.json();

      if (response.ok) {
        setLoading(false);
        dispatch(showAlert({ message: "Profile updated", status: "success" }));
        setTimeout(() => {
          router.push("/main");
        }, 2000);
      } else {
        setLoading(false);
        dispatch(
          showAlert({
            message: result.error || "Failed to update profile",
            status: "error",
          })
        );
      }
    } catch (err: any) {
      setLoading(false);
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors
          .map((error) => error.message)
          .join(", ");
        dispatch(showAlert({ message: errorMessages, status: "error" }));
      } else {
        dispatch(
          showAlert({
            message: err.message || "An unexpected error occurred",
            status: "error",
          })
        );
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setValue("profileImage", reader.result as string);
        // Reset the file input's value
        if (e.target instanceof HTMLInputElement) {
          e.target.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const session = await getSession();
      updateSession(session);
      setPreviewImage(session?.user?.image || null);

      // Set initial form values
      const initialFormValues = {
        id: session?.user?.id || "",
        email: session?.user?.email || "",
        profileImage: session?.user?.image || "",
        password: "",
        confirmPassword: "",
      };
      setInitialValues(initialFormValues);

      // Set form values
      setValue("id", initialFormValues.id);
      setValue("email", initialFormValues.email);
      setValue("profileImage", initialFormValues.profileImage);
    };
    getUser();
  }, [setValue]);

  // Watch form values
  const currentValues = watch();
  // Check if there are any changes
  const isFormChanged =
    JSON.stringify(currentValues) !== JSON.stringify(initialValues);

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Update Profile
        </Typography>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <Box sx={{ mb: 3 }}>
            <TextField
              label={session?.user?.email}
              variant="outlined"
              fullWidth
              disabled
              {...register("email")}
            />
          </Box>
          <Box sx={{ mb: 3, textAlign: "center", position: "relative" }}>
            <Avatar
              src={previewImage || ""}
              alt="Profile Image"
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            {previewImage ? (
              <IconButton
                onClick={() => {
                  setPreviewImage(""); // Reset the preview image
                  setValue("profileImage", ""); // Clear the profileImage field
                }}
                sx={{
                  position: "absolute",
                  top: "10%",
                  right: "40%",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 1)",
                  },
                }}
              >
                <CloseIcon sx={{ width: 10, height: 10 }} />
              </IconButton>
            ) : null}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" component="label">
                Upload New Picture
                <input
                  type="file"
                  hidden
                  accept="image/.png, image/.jpg, image/.jpeg"
                  max={2 * 1024 * 1024}
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
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
              disabled={!watch("password")}
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
            disabled={loading || !isFormChanged} // Disable if loading or no changes
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ProfileUpdateForm;
