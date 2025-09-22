import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "../Layout/Navbar.tsx";
import type { Enrollment, Role } from "../types.tsx";
import { getAllEnrolledUserByCourseId, removeEnrolledStudent } from "../utility/apiCalls";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Typography, IconButton, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useLocation } from "react-router";

export default function EnrolledStudents({role}: {role:Role}){
    const location = useLocation();

    const courseId = location.state?.courseId as number | undefined;
    const queryClient = useQueryClient()
    const { data: enrolledStudents } = useQuery({
        queryKey: ["enrolledStudents"],
        queryFn: () => getAllEnrolledUserByCourseId(courseId!),
        enabled: !!courseId
    })

    const enrolledList = enrolledStudents ? enrolledStudents : []
    

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
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrolledList.map((data:Enrollment) => (
              <TableRow
                key={data.user.id}
                hover
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "action.hover" } }}
              >
                <TableCell>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {(data?.user?.name?.[0] ?? "").toUpperCase()}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="500">{data.user.name}</Typography>
                </TableCell>
                <TableCell>{data.user.email}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {data.user.roles}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Remove this user from your course">
                    <IconButton color="error" size="small" onClick={async ()=> {await removeEnrolledStudent(data.enrollment_id),queryClient.invalidateQueries({ queryKey: ['enrolledStudents'] })}}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}