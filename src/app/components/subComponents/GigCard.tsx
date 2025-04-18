"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Collapse,
  Avatar,
  IconButton,
  IconButtonProps,
  Typography,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";
import { Gig, User } from "@prisma/client";
import { Badge } from "@mui/material";
import { Suspense } from "react";
import { SkeletonGigCard } from "../loading/SkeletonGigCard";
import Image from "next/image";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

const gigsPerPage = 5;

export const GigCard = ({ gig }: { gig: Gig }) => {
  const [expanded, setExpanded] = useState(false);
  const [gigPoster, updateGigPoster] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [totalPages, setTotalPages] = useState(1); // State to manage total pages

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const fetchGigPosterName = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch(`/api/users?id=${gig.user_id}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      const posterInfo: User = await response.json();
      updateGigPoster(posterInfo); // Update the gig poster name
      console.log("Fetched user:", posterInfo); // Log the fetched user
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      // Handle any cleanup or final actions here if needed
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching
    fetchGigPosterName();
    return () => {
      return undefined;
    };
  }, []);

  if (loading) {
    return <SkeletonGigCard />; // Show loading skeleton while fetching
  } else {
    return (
      <Card sx={{ maxWidth: "100%" }}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: blueGrey[500] }} aria-label="recipe">
                {gigPoster
                  ? gigPoster.image !== null || undefined || ""
                    ? gigPoster.image
                    : gigPoster.first_name && gigPoster.first_name[0]
                  : "U"}
              </Avatar>
            }
            title={gig.title}
            subheader={
              new Date(gig.createdAt).toDateString() +
              " by " +
              gigPoster?.first_name +
              " " +
              gigPoster?.last_name
            }
          />
          <Image
            width={100}
            height={200}
            style={{ width: "100%", height: "auto" }}
            src="/images/3d-printer.jpg" // Placeholder image
            alt={gig.title}
          />
          <CardMedia />
          <CardContent>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Category: {gig.category}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Price: ${gig.price}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography sx={{ marginBottom: 2 }}>Details:</Typography>
            <Typography sx={{ marginBottom: 2 }}>{gig.description}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
};
