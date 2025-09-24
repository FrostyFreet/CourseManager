import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import {Grid} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import defaultImage from "../public/default.webp";
import { Navbar } from '../Layout/Navbar.tsx';
import { Link, useLocation, useNavigate } from 'react-router';
import type { Role} from '../types.tsx';
import { deleteCourse, enrollCourse, fetchCourses, getCurrentUser }  from '../utility/apiCalls';

const mockData=[
    {
        "id": 1,
        "title": "Java Basics",
        "description": "Introduction to Java programming, covering syntax, variables, and control structures.",
        "startDate": "2025-10-01",
        "teacher": "John Smith"
    },
    {
        "id": 2,
        "title": "Spring Boot Essentials",
        "description": "Learn how to build REST APIs with Spring Boot, JPA, and PostgreSQL.",
        "startDate": "2025-11-15",
        "teacher": "Anna Johnson"
    },
    {
        "id": 3,
        "title": "React Fundamentals",
        "description": "Learn the basics of React: components, hooks, and state management.",
        "startDate": "2025-09-20",
        "teacher": "Emily Brown"
    },
    {
        "id": 4,
        "title": "Database Design",
        "description": "Understand relational databases, normalization, and SQL queries.",
        "startDate": "2025-12-05",
        "teacher": "Michael Davis"
    },
    {
        "id": 5,
        "title": "Advanced Java",
        "description": "Deep dive into OOP principles, collections, streams, and multithreading in Java.",
        "startDate": "2026-01-10",
        "teacher": "John Smith"
    }
]


export function CoursesPage({ role }: { role: Role } ) {
    const courses = useQuery({ queryKey: ['courses'], queryFn: () => fetchCourses() });
    const courseList = Array.isArray(courses.data) ? courses.data : mockData;
    const location = useLocation();
    const displayCourses = location.pathname === "/home" ? courseList.slice(0,10) : courseList
    const navigate = useNavigate()
    const { data: currentUser } = useQuery({
        queryKey: ["cUser",],
        queryFn: () => getCurrentUser(),
      });
      
    return (
        <>
        <Navbar role={role} />
        <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            {displayCourses.map((data) => (
                <Grid key={data.id}>
                        <Card sx={{ maxWidth: 345 }}>
                           <Link to={`/course/${data.title}`} state={{id:data.id}} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                                        Start: {data.startDate} | Teacher: {data.teacher ? data.teacher.name : data.teacher}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Link>
                            {currentUser && currentUser.roles === "ADMIN" ?
                            <>
                                <CardActions sx={{ justifyContent: "space-between" }}>
                                        <Button variant="outlined" value={data.id} size="small" color="primary" onClick={() => { navigate(`/edit-course/${data.title}`, { state: {id: data.id}})}}>
                                            Edit
                                        </Button>
                                        
                                        <Button variant="contained" value={data.id} size="small" color="primary" onClick={(e) => {deleteCourse(Number(e.currentTarget.value)), navigate(0)}}>
                                            Delete
                                        </Button>
                                        
                                </CardActions>
                            </>
                            :
                            <CardActions sx={{ justifyContent: "right" }}>
                                <Button variant="contained" value={data.id} size="small" color="primary" onClick={(e) => {enrollCourse(Number(e.currentTarget.value)), navigate(0)}}>
                                    Enroll
                                </Button>
                                        
                            </CardActions>
                            }
                        </Card>
                    
                </Grid>
            ))}
        </Grid>
        </>
    );
}