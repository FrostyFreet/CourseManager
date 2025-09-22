import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Navbar } from "../Layout/Navbar.tsx";
import defaultImage from "../public/default.webp";
import type { Course, Role } from "../types.tsx";
import { deleteCourse, getMyCourses } from "../utility/apiCalls";


export default function MyCourses({ role }: { role: Role }){
    const navigate = useNavigate()
    const { data: courses, isLoading, error } = useQuery({
        queryKey: ["myCourses"],
        queryFn: getMyCourses,
    });


    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading courses</p>;
    
    return (
        <>
        <Navbar role={role} />
        <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            {courses && courses.length > 0 ? (
                courses.map((data: Course) => (
                    <Grid key={data.id}>
                        <Card sx={{ maxWidth: 345 }}>
                            <Link to={`/course/${data.title}`} state={{id:data.id}} style={{ textDecoration: 'none', color:'inherit' }}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={data.imageUrl || defaultImage}
                                        alt="course"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div"
                                                    sx={{ fontFamily: '"Roboto", "Segoe UI", "Arial", sans-serif' }}>
                                            {data.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: 'text.secondary',
                                            fontFamily: '"Roboto", "Segoe UI", "Arial", sans-serif'
                                        }}>
                                            {data.description}
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                            Start: {new Date(data.startDate).toLocaleDateString()} | Teacher: {typeof data.teacher === "object" ? data.teacher.name : data.teacher}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Link>
                            <CardActions sx={{justifyContent: "space-between"}}>
                                <Button variant="outlined" size="small" color="primary" onClick={() => navigate(`/edit-course/${data.title}`, { state: { id: data.id } })}>                                   
                                     Edit
                                </Button>
                                <Button variant="contained" value={data.id} size="small" color="primary" onClick={(e) => { deleteCourse(Number(e.currentTarget.value)); navigate(0)}}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Wow, Such Empty!
                </Typography>
            )}
        </Grid>
        </>
   )
}