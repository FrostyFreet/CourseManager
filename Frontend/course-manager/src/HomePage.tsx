import {Navbar} from "./Navbar.tsx";

export function HomePage({ role }: { role: string | undefined }) {

    return (
        <>
            <Navbar role={role}/>

        </>
    )
}