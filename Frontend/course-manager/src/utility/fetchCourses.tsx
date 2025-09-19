import axios from "axios"

export default async function fetchCourses() {
    const response = await axios.get("http://localhost:8080/course/getAll",{
        headers: {
            'Authorization':'Bearer '+ localStorage.getItem("token")
        }
    })


    return response.data
}