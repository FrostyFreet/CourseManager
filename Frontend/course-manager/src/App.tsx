import { Login } from "./Login"
import {Route, Routes} from "react-router";
import {Register} from "./Register.tsx";

function App() {


  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />

      </Routes>

  )
}

export default App
