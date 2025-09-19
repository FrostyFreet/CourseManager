import { Typography, Box, Paper, Button, Stack, TextField, Input } from "@mui/material";
import axios from "axios"
import { useState, type FormEvent } from "react"
import { Navbar } from "./Navbar"
export default function CreateCoursePage({ role }: { role: string | undefined }) {
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

     async function handleUpload() {
        if (!file) return;
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("http://localhost:8080/upload", formData, {
                headers: { "Content-Type": "multipart/form-data",
                     "Authorization": "Bearer " + localStorage.getItem("token"),
                },
        });

        setUploadedUrl(res.data.url);
        console.log("Uploaded Cloudinary URL:", res.data.url);
    }

    async function createCourse(e: FormEvent){
        e.preventDefault()
        if (file && !formData.imageUrl) {
            await handleUpload();
        }
        try {
            const res = await axios.post(
            "http://localhost:8080/course/create",
            {
                title: formData.title,
                description: formData.description,
                startDate: formData.startDate,
                imageUrl: uploadedUrl,
            },
            {
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
            );

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
                    <TextField label="Title" name="title" fullWidth onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
                    variant="outlined"
                    />
                    <TextField label="Description" name="description" multiline rows={3} fullWidth onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                    variant="outlined"
                    />
                    <TextField label="Start Date" name="startDate" type="date" InputLabelProps={{ shrink: true }} fullWidth onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
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