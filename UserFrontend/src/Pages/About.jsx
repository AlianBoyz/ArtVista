import {
  Box,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";

const watercolorBg = {
  backgroundColor: "#fbfbfb",
  backgroundImage:
    "radial-gradient(circle at 14% 12%, rgba(135, 211, 229, 0.32), transparent 30%), radial-gradient(circle at 85% 12%, rgba(128, 203, 226, 0.28), transparent 28%), radial-gradient(circle at 15% 86%, rgba(255, 186, 156, 0.28), transparent 30%), radial-gradient(circle at 82% 78%, rgba(255, 222, 198, 0.22), transparent 30%), linear-gradient(130deg, #eefbff 0%, #ffffff 45%, #fff2ec 100%)",
};

const About = () => {
  return (
    <Box sx={{ ...watercolorBg, minHeight: "calc(100vh - 80px)", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 440px" },
            alignItems: "center",
            gap: { xs: 4, md: 7 },
            mb: { xs: 4, md: 6 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Box sx={{ pl: { md: 6 } }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  color: "#111",
                  fontSize: { xs: "2.4rem", md: "3rem" },
                  lineHeight: 1.1,
                  mb: 1,
                }}
              >
                About Us
              </Typography>
              <Typography variant="h4" sx={{ color: "#111", fontWeight: 500 }}>
                ArtVista
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <Box
              component="img"
              src="/artvista-auth/desi-art.png"
              alt="ArtVista artwork"
              sx={{
                width: "100%",
                height: { xs: 230, sm: 300 },
                objectFit: "cover",
                display: "block",
              }}
            />
          </motion.div>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: 1050,
              mx: "auto",
              p: { xs: 3, sm: 4, md: 6 },
              borderRadius: 2,
              boxShadow: "0 16px 35px rgba(0,0,0,0.18)",
              bgcolor: "rgba(255,255,255,0.96)",
            }}
          >
            <Typography variant="body1" sx={{ color: "#222", lineHeight: 1.45, fontSize: { xs: "1rem", md: "1.1rem" }, mb: 1.5 }}>
              The standard Lorem Ipsum passage, used since the 1500s "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            </Typography>

            <Typography variant="body1" sx={{ color: "#222", lineHeight: 1.45, fontSize: { xs: "1rem", md: "1.1rem" }, mb: 1.5 }}>
              Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC
            </Typography>

            <Typography variant="body1" sx={{ color: "#222", lineHeight: 1.45, fontSize: { xs: "1rem", md: "1.1rem" } }}>
              "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolore ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;
