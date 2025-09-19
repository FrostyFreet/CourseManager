import { jwtDecode } from "jwt-decode";
// import refreshToken from "./refreshToken";

export default async function checkIsLoggedIn() {
    const storedToken = localStorage.getItem("token")
    const now = Date.now() / 1000

    if (!storedToken ) return false

    const decoded: any = jwtDecode(storedToken)
    
    if(decoded.exp < now) return false
    

    return decoded
}
