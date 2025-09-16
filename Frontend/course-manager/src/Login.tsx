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
import {type ChangeEvent, type FormEvent, useState} from "react"
import {useNavigate} from "react-router"
import axios from 'axios'

interface LoginProps {
    setToken: (token: string) => void
    setRole: (role: string) => void
}

export function Login({ setToken, setRole }: LoginProps) {

    const [email,setEmail] = useState<string>()
    const [password,setPassword] = useState<string>()


    const navigate = useNavigate();
    function login(e:FormEvent){
        e.preventDefault()

        axios.post("http://localhost:8080/auth/login",{
            email: email,
            password:password
        }).then((response) => {
            setToken(response.data.token)
            setRole(response.data.role)
            localStorage.setItem("token", response.data.token)
        })
            .catch((err: Error) =>{
                console.log(err)
        })

        setPassword("")
        setEmail("")

        navigate("/home")
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
            <Card sx={{ minWidth: 350, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={login}>
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

                            <Button variant="contained" type="submit" fullWidth>
                                Sign In
                            </Button>

                            <Typography align="center" variant="body2">
                                Don't have an account?{" "}
                                <Link component="button" variant="body2" onClick={() => navigate("/register")}>
                                    Register
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}