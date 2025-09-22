import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../Layout/Navbar.tsx";
import type { Enrollment, Role } from "../types.tsx";
import { fetchMyEnrollMents, withDrawCourse } from "../utility/apiCalls";
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import { Link, useNavigate } from "react-router";
import defaultImage from "../public/default.webp";


export function EnrollmentsPage({ role }: { role: Role }){
    const navigate = useNavigate()

    const { data: enrollments, isLoading, error } = useQuery({
        queryKey: ["enrollment"],
        queryFn:  async () => await fetchMyEnrollMents(),
    })

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading your enrollments</p>;
    const enrollmentList = Array.isArray(enrollments) ? enrollments : [];
    
    console.log(enrollments);
    
    
    return(
        <>
        <Navbar role={role}/>
        {
            <Grid container spacing={4} sx={{ justifyContent: "center" }}>
                {enrollmentList.length > 0 ? (
                    enrollmentList.map((data: Enrollment) => (
                    <Grid key={data.enrollment_id}>
                        <Card sx={{ maxWidth: 345 }}>
                            <Link to={`/course/${data.course.title ?? ""}`} state={{id:data.course.id}}style={{ textDecoration: 'none', color: 'inherit' }}>
                                <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={data.course?.imageUrl || defaultImage}
                                    alt="course"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5">
                                    {data.course?.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    {data.course?.description}
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                    Start: {new Date(data.course?.startDate).toLocaleDateString()} | Teacher: {typeof data.course?.teacher === "object" ? data.course?.teacher.name : "unkown"}
                                    </Typography>
                                </CardContent>
                                </CardActionArea>
                            </Link>
                            <CardActions sx={{ justifyContent: "space-between" }}>
                             <Button variant="outlined" size="small" color="primary">
                                Share
                            </Button>
                            <Button variant="contained" value={data.enrollment_id} size="small" color="primary" onClick={async (e) => { await withDrawCourse(Number(e.currentTarget.value)), navigate(0)}}>
                               Withdraw
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

        })
    </>
    )
}