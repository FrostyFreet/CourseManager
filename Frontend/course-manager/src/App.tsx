import { Login } from "./Login"
import {Route, Routes} from "react-router";
import {Register} from "./Register.tsx";
import {useState} from "react";
import {HomePage} from "./HomePage.tsx";
import "./App.css"

function App() {
    const [token, setToken] = useState<string>()
    const [role,setRole] = useState<string>()




  return (
      <Routes>
        <Route path="/" element={<Login setToken={setToken} setRole={setRole}  />} />
        <Route path="register" element={<Register />} />
        <Route path={"/home"} element={<HomePage role={role} />}  />

      </Routes>

  )
}

export default App
