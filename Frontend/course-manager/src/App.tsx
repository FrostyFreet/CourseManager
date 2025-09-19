import { Login } from "./Authentication/Login.tsx"
import {Route, Routes, useNavigate} from "react-router";
import {Register} from "./Authentication/Register.tsx";
import { useEffect, useState} from "react";
import {HomePage} from "./HomePage.tsx";
import "./App.css"
import {CoursesPage} from "./CoursesPage.tsx";
import {QueryClient, QueryClientProvider } from "@tanstack/react-query";
import checkIsLoggedIn from "./utility/checkIsLoggedIn.tsx";
import CreateCoursePage from "./CreateCoursePage.tsx";

const queryClient = new QueryClient()

function App() {
    const [token, setToken] = useState<string>()
    const [role,setRole] = useState<string>()
    const [isLoggedIn, setIsLoggedIn]=useState<boolean>(false)

    const navigate = useNavigate()
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
                navigate("/")
            }
        }
        fetch()
        
    },[navigate])


    return (
        <QueryClientProvider client={queryClient}>
            <Routes >
                <Route path={"/"} element={<Login setToken={setToken} setRole={setRole} setIsLoggedIn={setIsLoggedIn}  />} />
                <Route path={"/register"} element={<Register />} />
                <Route path={"/home"} element={<HomePage role={role} />}  />
                <Route path={"/courses"} element={<CoursesPage role={role} />} />
                <Route path={"/create-course"} element={<CreateCoursePage role={role}/>} />
            </Routes>
        </QueryClientProvider>

    )
}

export default App
