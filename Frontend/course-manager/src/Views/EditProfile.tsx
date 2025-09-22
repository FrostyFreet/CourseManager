import { useLocation } from "react-router";
import type { Role } from "../types";
import { Navbar } from "../Layout/Navbar";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getUserById, updateUser } from "../utility/apiCalls";
import { useEffect, useState } from "react";

export function EditProfile({ role }: { role: Role }) {
  const location = useLocation();
  const state = location.state;
  const id = state?.id as number | undefined;

  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
  
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [status,setStatus] = useState<'success' | 'failed' | 'password dont match'>()

  const [formData, setFormData] = useState({
    id: id ?? null,
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
  if (currentUser && formData.name === "" && formData.email === "") {
      setFormData({
        id: id ?? null,
        name: currentUser.name ?? "",
        email: currentUser.email ?? "",
        password: "",
      });
    }
    }, [currentUser, id, formData.name, formData.email]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading user</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setStatus('password dont match')
      return
    }

    const payload = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      ...(password ? { password } : {}),
    };

    try {
      await updateUser(payload);
      setStatus("success")
      setFormData({
         id: id ?? null,
         name: currentUser.name ?? "",
         email: currentUser.email ?? "",
         password: "",
      })

    } catch (err) {
      setStatus("failed")
      console.error("Failed to update profile", err);
    }
  };

  return (
    <>
      <Navbar role={role} />
      <Container maxWidth="sm">
        <Box mt={5} p={3} boxShadow={3} borderRadius={2}>
          <Typography variant="h4" mb={3}>
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              margin="normal"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              margin="normal"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={password}
              fullWidth
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              name="confirm-password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Save Changes
            </Button>
            {status && (
                <Alert
                    severity={
                    status === 'success' ? 'success' : status === 'failed' ? 'error' : 'warning'
                    }
                    sx={{ mt: 2 }}
                >
                    {status === 'success'
                    ? 'Profile updated successfully!'
                    : status === 'failed'
                    ? 'Failed to update profile.'
                    : 'Passwords do not match.'}
                </Alert>
                )}
          </form>
        </Box>
      </Container>
    </>
  );
}