import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const contactArt = "/artvista-auth/desi-art.png";

const watercolorBg = {
  backgroundColor: "#fbfbfb",
  backgroundImage:
    "radial-gradient(circle at 10% 20%, rgba(255, 183, 160, 0.35), transparent 26%), radial-gradient(circle at 86% 16%, rgba(123, 211, 230, 0.3), transparent 30%), radial-gradient(circle at 82% 78%, rgba(151, 222, 226, 0.28), transparent 30%), radial-gradient(circle at 28% 78%, rgba(255, 220, 199, 0.3), transparent 28%), linear-gradient(120deg, #fff7f1 0%, #ffffff 48%, #edfaff 100%)",
};

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    query: "",
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Contact form submitted:", form);
    alert("Thank you for contacting us! We will get back to you soon.");
    setForm({ name: "", email: "", query: "" });
  };

  return (
    <Box sx={{ ...watercolorBg, minHeight: "calc(100vh - 70px)", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 430px" },
            alignItems: "center",
            gap: { xs: 4, md: 7 },
            mb: { xs: 4, md: 5 },
          }}
        >
          <Box sx={{ pl: { md: 4 } }}>
            <Typography variant="h1" sx={{ fontWeight: 800, color: "#151515", fontSize: { xs: "2.25rem", md: "3rem" }, mb: 1 }}>
              Contact Us
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 500, color: "#151515" }}>
              ArtVista
            </Typography>
          </Box>
          <Box
            component="img"
            src={contactArt}
            alt="ArtVista contact"
            sx={{ width: "100%", height: { xs: 230, sm: 300 }, objectFit: "cover", display: "block", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            maxWidth: 760,
            mx: "auto",
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
            boxShadow: "0 16px 35px rgba(0,0,0,0.16)",
            bgcolor: "rgba(255,255,255,0.96)",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2.5 }}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
            <TextField label="Email ID" type="email" name="email" value={form.email} onChange={handleChange} required fullWidth />
            <TextField
              label="Comment your query"
              name="query"
              value={form.query}
              onChange={handleChange}
              required
              fullWidth
              multiline
              minRows={5}
            />
            <Button type="submit" variant="contained" sx={{ justifySelf: { xs: "stretch", sm: "start" }, minWidth: 180, py: 1.2, bgcolor: "#5146c9" }}>
              Send Message
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
