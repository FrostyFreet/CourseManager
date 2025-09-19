import {CoursesPage} from "./CoursesPage.tsx";

export function HomePage({ role }: { role: string | undefined}) {
   

    return (
        <>
            <CoursesPage role={role} />
        </>
    )
}