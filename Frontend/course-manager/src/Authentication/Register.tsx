import {
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
    Button,
    Box,
    CardContent,
    Card,
    Typography,
    Link
} from "@mui/material"
import { type ChangeEvent, type FormEvent, useState } from "react"
import axios from "axios"
import {useNavigate} from "react-router";

export function Register() {
    const [email, setEmail] = useState<string>("")
    const [fullName, setFullName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [passwordAgain, setPasswordAgain] = useState<string>("")
    const [status, setStatus] = useState<"Registration failed." | "Passwords do not match." | "Registered! Now you can log in!">()
    const url = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate()

    function register(e: FormEvent) {
        e.preventDefault()

        if (password !== passwordAgain) {
            setStatus("Passwords do not match.")
            return
        }

        axios.post(`${url}/auth/register`, {
            email: email,
            name:fullName,
            password: password
        }).then(() => {
            setStatus("Registered! Now you can log in!")
        }).catch((err: Error) => {
            setStatus("Registration failed.")
            console.log(err)
        })

        setPassword("")
        setPasswordAgain("")
        setFullName("")
        setEmail("")
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
            <Card sx={{ minWidth: 350, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Register
                    </Typography>
                    <form onSubmit={register}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <FormControl variant="standard" required>
                                <InputLabel htmlFor="email">Email address</InputLabel>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    aria-describedby="email-helper-text"
                                />
                                <FormHelperText id="email-helper-text">We'll never share your email.</FormHelperText>
                            </FormControl>

                            <FormControl variant="standard" required>
                                <InputLabel htmlFor="fullName">Full Name</InputLabel>
                                <Input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                                />

                            </FormControl>

                            <FormControl variant="standard" required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    aria-describedby="password-helper-text"
                                />
                                <FormHelperText id="password-helper-text"></FormHelperText>
                            </FormControl>
                            <FormControl variant="standard" required>
                                <InputLabel htmlFor="password-again">Confirm Password</InputLabel>
                                <Input
                                    type="password"
                                    id="password-again"
                                    value={passwordAgain}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordAgain(e.target.value)}
                                    aria-describedby="password-again-helper-text"
                                />
                                <FormHelperText id="password-again-helper-text"></FormHelperText>
                            </FormControl>
                            {status ?  (
                                status === "Passwords do not match." || status==="Registration failed." ? (
                                <Typography color="error" align="center" variant="body2">
                                    {status}
                                </Typography>
                                )
                                :
                                (
                                  <Typography color="success" align="center" variant="body2">
                                    {status}
                                </Typography>
                                
                            )):null}
                            <Button variant="contained" type="submit" fullWidth>
                                Register
                            </Button>

                            <Typography align="center" variant="body2">
                               Go back to {" "}
                                <Link component="button" variant="body2" onClick={() => navigate("/")}>
                                    login
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}