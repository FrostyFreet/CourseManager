import {
    AppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material"
import { type MouseEvent, useState } from "react"
import MenuIcon from '@mui/icons-material/Menu'
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import {useNavigate} from "react-router";

const admin = ['Összes kurzus', 'Felhasználók', 'Beiratkozások']
const teacher = ['Kurzusaim']
const student = ['Összes kurzus', 'Beiratkozásaim']


export function Navbar({ role }: { role: string | undefined }) {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget)
    }
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }
    const handleCloseNavMenu = () => setAnchorElNav(null)
    const handleCloseUserMenu = () => setAnchorElUser(null)

    const navigate = useNavigate()

    const roleDisplay = {
        ROLE_ADMIN: "Admin",
        ROLE_TEACHER: "Teacher",
        ROLE_STUDENT: "Student"
    }[role ?? ""] ?? "Guest"

    return (
        <AppBar
            position="static"
            sx={{background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)", boxShadow: 4}}>

            <Toolbar disableGutters sx={{ justifyContent: "space-between", px:2 }}>
                    <AutoStoriesIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: '"Roboto", "Segoe UI", "Arial", sans-serif',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        CourseManager
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {role === "ROLE_STUDENT" && student.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                            {role === "ROLE_TEACHER" && teacher.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                            {role === "ROLE_ADMIN" && admin.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AutoStoriesIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: '"Roboto", "Segoe UI", "Arial", sans-serif',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        CourseManager
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {role === "ROLE_STUDENT" && student.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    '&:hover': { backgroundColor: '#1565c0' }
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                        {role === "ROLE_TEACHER" && teacher.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    '&:hover': { backgroundColor: '#1565c0' }
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                        {role === "ROLE_ADMIN" && admin.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    '&:hover': { backgroundColor: '#1565c0' }
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'white',
                                fontWeight: 500,
                                mr: 1,
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                                background: 'rgba(255,255,255,0.08)'
                            }}
                        >
                            {roleDisplay}
                        </Typography>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => {
                                localStorage.removeItem("token");
                                handleCloseUserMenu();
                                navigate("/");
                                }}>
                                <Typography sx={{ textAlign: 'center' }}>Log Out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
        </AppBar>
    )
}