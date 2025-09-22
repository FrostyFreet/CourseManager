import {CoursesPage} from "./CoursesPage.tsx";
import type { Role } from "../types.tsx";

export function HomePage({ role }: { role: Role }) {
   

    return (
        <>
            <CoursesPage role={role} />
        </>
    )
}