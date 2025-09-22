import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Navbar } from "../Layout/Navbar.tsx";
import type { Role } from "../types.tsx";
import { useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseById, updateMyCourse } from "../utility/apiCalls";

export default function EditCourse({ role }: { role: Role }) {
  const location = useLocation()
  const state = location.state
  const id = state?.id
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: Number(""),
    title: "",
    description: "",
    startDate: "",
    imageUrl: ""
  });

  const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ["courseByTitle", id],
    queryFn: () => fetchCourseById(id),
    enabled: !!id,
  });
  
  useEffect(() => {
    if (course) {
      setFormData({
        id:course.id ?? "",
        title: course.title ?? "",
        description: course.description ?? "",
        startDate: course.startDate ?? "",
        imageUrl: course.imageUrl ?? ""
      });
    }
  }, [course]);

  if (courseLoading) return <p>Loading...</p>;
  if (courseError) return <p>Error loading course</p>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateMyCourse(formData);
      navigate(-1);
    } catch (err) {
      console.error("Failed to update course", err);
    }
  };

  return (
    <>
      <Navbar role={role} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            Edit Course
          </Typography>

          <Box
            component="form"
            onSubmit={handleSave}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mt: 2,
            }}
          >
            <TextField
              label="Course Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />

            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}