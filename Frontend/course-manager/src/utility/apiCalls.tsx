import axios from "axios"
import { jwtDecode } from "jwt-decode"

export async function fetchCourses() {
    const response = await axios.get("http://localhost:8080/course/getAll",{
        headers: { 'Authorization':'Bearer '+ localStorage.getItem("token") }
    })
    return response.data
}

export async function fetchCourseById(id:number) {
    const response = await axios.get(`http://localhost:8080/course/getById/${id}`,{
        headers: { 'Authorization':'Bearer '+ localStorage.getItem("token") }
    })
    return response.data
}

export async function fetchCourseByTitle(title:string){
     const response = await axios.get(`http://localhost:8080/course/getByTitle/${title}`,{
        headers: { 'Authorization':'Bearer '+ localStorage.getItem("token") }
    })
    return response.data
}

export async function getMyCourses(){
       const res = await axios.get("http://localhost:8080/course/getCoursesByTeacher",{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })

        return res.data
}
export async function updateMyCourse(course: {
  id: number
  title: string
  description: string
  startDate: string
  imageUrl: string
}) {
  const res = await axios.put("http://localhost:8080/course/update", course, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  return res.data
}


export async function fetchMyEnrollMents(){
     const res = await axios.get("http://localhost:8080/enrollment/getAll",{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })

        return res.data
}

export async function removeEnrolledStudent(id:number){
     const res = await axios.delete(`http://localhost:8080/enrollment/deleteById/${id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })

        return res.data
}

export async function getAllEnrolledUserByCourseId(id:number){
    const res = await axios.get(`http://localhost:8080/enrollment/getAllByCourseId/${id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}



export async function getUserById(id:number){
    const res = await axios.get(`http://localhost:8080/users/getById/${id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}

export async function getCurrentUser(){
    const res = await axios.get(`http://localhost:8080/users/getCurrentUserByEmail`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}

export async function updateUser(payload){
    const res = await axios.put(`http://localhost:8080/users/update/${payload.id}`,
        payload,
        {
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}




export async function deleteUser(id:number){
    const res = await axios.delete(`http://localhost:8080/users/deleteById/${id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}

export async function getAllUsers(){
     const res = await axios.get(`http://localhost:8080/users/getAll`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}

export async function enrollCourse(courseId:number){
    const res = await axios.post("http://localhost:8080/enrollment/create",
            {
            course: { id: courseId } 
            },
            {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
            }
        )

    return res.data
}
export async function withDrawCourse(enrollment_id:number){
    const res = await axios.delete(`http://localhost:8080/enrollment/deleteById/${enrollment_id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })

    return res.data
}

export async function deleteCourse(courseId:number){
    const res = await axios.delete(`http://localhost:8080/course/deleteById/${courseId}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })

    return res.data
}


export async function checkIsLoggedIn() {
    let storedToken = localStorage.getItem("token")
    const refreshToken = localStorage.getItem("refreshToken")
    const now = Date.now() / 1000

    if (!storedToken) return false

    let decoded: any
    try {
        decoded = jwtDecode(storedToken)
    } catch {
        localStorage.removeItem("token")
        return false
    }

    if (decoded.exp > now)  return decoded
    

    if (!refreshToken) return false
    

    try {
        const res = await fetch("http://localhost:8080/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        })

        if (!res.ok) {
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            return false
        }

        const data = await res.json()
        localStorage.setItem("token", data.token)
        localStorage.setItem("refreshToken", data.refreshToken)

        decoded = jwtDecode(data.token)
        return decoded

    } catch (err) {
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        return false
    }
}

export async function logOut(){
     const refreshToken = localStorage.getItem("refreshToken")
     const token = localStorage.getItem("token")
     try {
        const res = await axios.post("http://localhost:8080/auth/logOut",{
            refreshToken
        })
        if (refreshToken) localStorage.removeItem("refreshToken")
        if (token) localStorage.removeItem("token");


    

     return res.data

    } catch (err) {
      
        return "Error while logging out!"+err
    }
}
