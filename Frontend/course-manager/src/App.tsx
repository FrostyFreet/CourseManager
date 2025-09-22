import { Login } from "./Authentication/Login.tsx"
import {Route, Routes, useLocation, useNavigate} from "react-router";
import {Register} from "./Authentication/Register.tsx";
import { useEffect, useState} from "react";
import {HomePage} from "./Views/HomePage.tsx";
import "./App.css"
import {CoursesPage} from "./Views/CoursesPage.tsx";
import {QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateCoursePage from "./Views/CreateCoursePage.tsx";
import CoursePage from "./Views/CoursePage.tsx";
import MyCourses from "./Views/MyCourses.tsx";
import type { Role } from "./types.tsx";
import { checkIsLoggedIn } from "./utility/apiCalls.tsx";
import { EnrollmentsPage } from "./Views/EnrollmentsPage.tsx";
import UsersPage from "./Views/UsersPage.tsx";
import EnrolledStudents from "./Views/EnrolledStudents.tsx";
import EditCourse from "./Views/EditCourse.tsx";
import { EditProfile } from "./Views/EditProfile.tsx";


const queryClient = new QueryClient()

function App() {
    const [token, setToken] = useState<string>()
    const [role,setRole] = useState<Role>()
    const [isLoggedIn, setIsLoggedIn]=useState<boolean>(false)

    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        const fetch  = async () => {
          const result = await checkIsLoggedIn()
            if (result) {
                const token = localStorage.getItem("token")
                if (token) setToken(token)
                setRole(result.role)
                setIsLoggedIn(true)
            } else {
                setToken(undefined)
                setIsLoggedIn(false)
                if (location.pathname !== "/" && location.pathname !== "/register"){
                    navigate("/")
                }
            }
        }
        fetch()
        
    },[navigate, location.pathname])


    return (
        <QueryClientProvider client={queryClient}>
            <Routes >
                
                <Route path={"/"} element={<Login setToken={setToken} setRole={setRole} setIsLoggedIn={setIsLoggedIn}  />} />
                <Route path={"/register"} element={<Register />} />
               
                <Route path={"/home"} element={<HomePage role={role} />}  />
                <Route path={"/courses"} element={<CoursesPage role={role} />} />
                <Route path={"/create-course"} element={<CreateCoursePage role={role}/>} />
                <Route path={"/course/:name"} element={<CoursePage role={role} />} />
                <Route path={"/my-courses"} element={<MyCourses  role={role} />}/>
                <Route path={"/enrollments"} element={<EnrollmentsPage  role={role} />}/>
                <Route path={"/users"} element={<UsersPage  role={role} />}/>
                <Route path={"/enrolledStudents"} element={<EnrolledStudents  role={role} />}/>
                <Route path={"/edit-course/:name"} element={<EditCourse role={role} />}/>
                <Route path={"/edit-profile/:name"} element={<EditProfile role={role} />}/>
                
            </Routes>
        </QueryClientProvider>

    )
}

export default App
