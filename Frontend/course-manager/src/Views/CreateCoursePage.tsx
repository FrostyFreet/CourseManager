import { Typography, Box, Paper, Button, Stack, TextField, Input } from "@mui/material";
import axios from "axios"
import { useState, type FormEvent } from "react"
import { Navbar } from "../Layout/Navbar.tsx"
import type { Role } from "../types.tsx";

export default function CreateCoursePage({ role }: { role: Role }) {
   const [formData, setFormData] = useState({
        "title": "",
        "description": "",
        "startDate": "",
        "imageUrl": ""
    })

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    }

     async function handleUpload(): Promise<string | null> {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("http://localhost:8080/upload", formData, {
            headers: { 
                "Content-Type": "multipart/form-data",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        });

        return res.data.url;
    }


    async function createCourse(e: FormEvent) {
        e.preventDefault();

        let imageUrl = uploadedUrl;

        if (file && !formData.imageUrl) {
            imageUrl = await handleUpload();
        }

        try {
            const res = await axios.post(
                "http://localhost:8080/course/create",
                {
                    title: formData.title,
                    description: formData.description,
                    startDate: formData.startDate,
                    imageUrl: imageUrl, 
                },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );

            setFormData({
                title: "",
                description: "",
                startDate: "",
                imageUrl: ""
            });
            setFile(null);
            setPreview(null);
            setUploadedUrl(null);

            console.log("Course created successfully:", res.data);
        } catch (err) {
            console.error("Error creating course:", err);
        }
    }


     return (
        <>
        <Navbar role={role}/>
        
            <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{ backgroundColor: "#f5f5f5", p: 2 }}
            >
            <Paper
                elevation={4}
                sx={{
                p: 4,
                maxWidth: 500,
                width: "100%",
                borderRadius: 3,
                }}
            >
                <Typography variant="h4" align="center" gutterBottom
                    sx={{
                        fontWeight: "bold", WebkitBackgroundClip: "text", color:"white",
                        background: "linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6)"}}> 
                    Create Your Own Course
                    </Typography>

                <form onSubmit={createCourse}>
                
                <Stack spacing={3}>
                    <TextField label="Title" name="title" fullWidth value={formData.title} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
                    variant="outlined"
                    />
                    <TextField label="Description" name="description" multiline rows={3} value={formData.description} fullWidth onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                    variant="outlined"
                    />
                    <TextField label="Start Date" name="startDate" type="date" value={formData.startDate} InputLabelProps={{ shrink: true }} fullWidth onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                    variant="outlined"
                    />
                    <Input type="file" onChange={handleFileChange}/>
                    {preview && <img src={preview} alt="preview" width={200}/>}
                    
                    <Button type="submit" variant="contained" size="large"sx={{ borderRadius: 2 }}>
                    Create Course
                    </Button>

                </Stack>
                
                </form>
            </Paper>
            </Box>
        </>
    )
}