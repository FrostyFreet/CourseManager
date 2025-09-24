import axios from "axios"
import { jwtDecode } from "jwt-decode"
const url = import.meta.env.VITE_API_BASE_URL

export async function fetchCourses() {
    const response = await axios.get(`${url}/course/getAll`,{
        headers: { 'Authorization':'Bearer '+ localStorage.getItem("token") }
    })
    return response.data
}

export async function fetchCourseById(id:number) {
    const response = await axios.get(`${url}/course/getById/${id}`,{
        headers: { 'Authorization':'Bearer '+ localStorage.getItem("token") }
    })
    return response.data
}

export async function fetchCourseByTitle(title:string){
     const response = await axios.get(`${url}/course/getByTitle/${title}`,{
        headers: { 'Authorization':'Bearer '+ localStorage.getItem("token") }
    })
    return response.data
}

export async function getMyCourses(){
       const res = await axios.get(`${url}/course/getCoursesByTeacher`,{
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
  const res = await axios.put(`${url}/course/update`, course, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  return res.data
}


export async function fetchMyEnrollMents(){
     const res = await axios.get(`${url}/enrollment/getAll`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })

        return res.data
}

export async function removeEnrolledStudent(id:number){
     const res = await axios.delete(`${url}/enrollment/deleteById/${id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })

        return res.data
}

export async function getAllEnrolledUserByCourseId(id:number){
    const res = await axios.get(`${url}/enrollment/getAllByCourseId/${id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}



export async function getUserById(id:number){
    const res = await axios.get(`${url}/users/getById/${id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}

export async function getCurrentUser(){
    const res = await axios.get(`${url}/users/getCurrentUserByEmail`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}

export async function updateUser(payload:any){
    const res = await axios.put(`${url}/users/update/${payload.id}`,
        payload,
        {
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}




export async function deleteUser(id:number){
    const res = await axios.delete(`${url}/users/deleteById/${id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}

export async function getAllUsers(){
     const res = await axios.get(`${url}/users/getAll`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
    })

    return res.data
}

export async function enrollCourse(courseId:number){
   
    try{
        const res = await axios.post(`${url}/enrollment/create`,
            {
            course: { id: courseId } 
            },
            {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
            }
        )
        return {...res.data, status:true}
    }
    catch(e){
         return {status:false}
    }
   

   
}
export async function withDrawCourse(enrollment_id:number){
    const res = await axios.delete(`${url}/enrollment/deleteById/${enrollment_id}`,{
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })

    return res.data
}

export async function deleteCourse(courseId:number){
    const res = await axios.delete(`${url}/course/deleteById/${courseId}`,{
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
        const res = await fetch(`${url}/auth/refresh`, {
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
        const res = await axios.post(`${url}/auth/logOut`,{
            refreshToken
        })
        if (refreshToken) localStorage.removeItem("refreshToken")
        if (token) localStorage.removeItem("token");


    

     return res.data

    } catch (err) {
      
        return "Error while logging out!"+err
    }
}
