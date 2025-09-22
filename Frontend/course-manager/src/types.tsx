
export interface Course{
        id: number
        title:string
        description:string
        startDate:Date
        imageUrl:string
        teacher:User
}
export interface User{
        id: number
        name:string
        email:string
        password:string
        roles:string | undefined
}

export interface Enrollment {
        enrollment_id:number
        user:User
        course:Course
}
export type Role = string | undefined

