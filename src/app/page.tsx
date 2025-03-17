import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import LandingNav from "./components/header/LandingNav";

const Home = () => {
  return (
    <div>
      <LandingNav />
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            backgroundImage: "url('/images/hero-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Our Print-On-Demand Service
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            High-quality printing services at your fingertips.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
        </Box>

        {/* Advertisement Section */}
        <Box sx={{ py: 5 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Advertisements
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/ad1.jpg"
                  alt="Advertisement 1"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Ad Title 1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description of the advertisement.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/ad2.jpg"
                  alt="Advertisement 2"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Ad Title 2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description of the advertisement.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/ad3.jpg"
                  alt="Advertisement 3"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Ad Title 3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description of the advertisement.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* YouTube Video Section */}
        <Box sx={{ py: 5 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Watch Our Introduction Video
          </Typography>
          <Box
            sx={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Introduction Video"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></iframe>
          </Box>
        </Box>

        {/* Services Section */}
        <Box sx={{ py: 5 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Our Services
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/service1.jpg"
                  alt="Service 1"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Service 1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description of the service.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/service2.jpg"
                  alt="Service 2"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Service 2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description of the service.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/service3.jpg"
                  alt="Service 3"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Service 3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description of the service.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* About Section */}
        <Box sx={{ py: 5 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            We are a leading print-on-demand service provider, offering
            high-quality printing solutions for businesses and individuals. Our
            mission is to deliver exceptional printing services with a focus on
            quality, reliability, and customer satisfaction.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
