import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "../Layout/Navbar.tsx";
import type { Role, User } from "../types.tsx";
import { deleteUser, getAllUsers } from "../utility/apiCalls";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Typography, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router";

export default function UsersPage({role}: {role:Role}){

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { data: users, isLoading, error } = useQuery({
           queryKey: ["users"],
           queryFn: () => getAllUsers(),
       })
    
    
       
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading your enrollments</p>;

    return (
    <>
      <Navbar role={role} />
      <TableContainer component={Paper} elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Avatar</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Role</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <TableRow
                key={user.id}
                hover
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "action.hover" } }}
              >
                <TableCell>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {user.name[0].toUpperCase()}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="500">{user.name}</Typography>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.roles}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={()=> {navigate("/editUser")}}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={async ()=> {await deleteUser(user.id), queryClient.invalidateQueries({ queryKey: ['users'] })
}}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}