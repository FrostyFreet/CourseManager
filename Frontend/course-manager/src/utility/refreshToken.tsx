import axios from "axios";

export default async function refreshToken() {
    
    try {
        console.log("trying to refresh token")
        const res = await axios.post("http://localhost:8080/auth/refresh", {}, { 
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(res)

        const newToken = res.data.token
        localStorage.setItem("token", newToken)
        console.log("Token refreshed")
        return newToken
    } catch (err) {
        console.log("Refresh failed", err)
        localStorage.removeItem("token")
        
        return null
    }
}