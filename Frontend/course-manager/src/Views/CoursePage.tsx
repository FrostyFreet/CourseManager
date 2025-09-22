import { useLocation, useNavigate } from "react-router";
import type { Role } from "../types.tsx";
import { Navbar } from "../Layout/Navbar.tsx";
import { useQuery } from "@tanstack/react-query";
import defaultImage from "../public/default.webp";

import { Container, CircularProgress, Alert, Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import { fetchCourseById, getCurrentUser } from "../utility/apiCalls";



export default function CoursePage({ role }: { role: Role }){
    const navigate = useNavigate()  
    const location = useLocation()
    const state = location.state
    const id = state?.id
    

   const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
        queryKey: ["courseById", id],
        queryFn: () => fetchCourseById(id!),
        enabled: !!id,
    });

    const { data: currentUser, isLoading: userLoading, error: userError } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUser(),
        enabled: !!localStorage.getItem("token"),
    });
    const teacherId = course?.teacher?.id
    const currentUserId = currentUser?.id
    const currentUseRole = currentUser?.role
   
    
    return (
        <>
          <Navbar role={role} />
          <Container sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
            {(courseLoading || userLoading) && <CircularProgress />}
            {(courseError || userError) && <Alert severity="error">Error loading course</Alert>}
          {course && (
            <Card sx={{ maxWidth: 800, width: "100%", borderRadius: 3, boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="300"
                image={course.imageUrl || defaultImage}
                alt={course.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {course.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {course.description}
                </Typography>
               <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="subtitle1">
                      <strong>Start Date:</strong>{" "}
                      {course.startDate ? new Date(course.startDate).toLocaleDateString() : course.startDate}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Teacher:</strong>{" "}
                      {typeof course.teacher === "object" ? course.teacher?.name : course.teacher}
                    </Typography>
                  </Box>
                  {(currentUseRole === "ADMIN" || currentUserId === teacherId) &&

                  <Box sx={{ mt: 3}}>
                    <Button variant="contained" size="small" color="primary" onClick={()=> navigate("/enrolledStudents", {state: {courseId:course.id}})}>
                      Check enrolled users
                    </Button>
                  </Box>
                  }
                </Box>
                  
                  
              </CardContent>
            </Card>
          )}
        </Container>
    </>
    
  )
}