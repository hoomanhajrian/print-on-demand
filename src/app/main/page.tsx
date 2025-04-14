"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Input,
  Typography,
  Container,
  Box,
  Pagination,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Gig } from "@prisma/client";
import { GigCard } from "@/app/components/subComponents/GigCard";

interface fetchedGigs {
  paginatedGigs: Gig[][]; // Array of arrays, each containing gigs for a page
  totalGigs: number;
  totalPages: number;
}

// gigs per page
const gigsPerPage = 6;

const UserDashboard = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch the session on the server side
  const session = useSession();

  // Extract user information from the session
  const user = session?.data?.user || null;
  // If no session or user, prompt the user to log in
  if (!user) {
    redirect("/");
  }
  // Fetch gigs from the API
  // This function fetches gigs from the API and sets the state
  const fetchGigs = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch(`/api/gigs`);
      if (!response.ok) throw new Error("Failed to fetch gigs");
      const fetchedData = await response.json();
      console.info("Fetched gigs:", fetchedData);
      setTotalPages(fetchedData.totalPages); // Set total pages from the response
      setGigs(fetchedData.paginatedGigs[currentPage - 1]); // Set gigs for the current page
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []); // Fetch gigs when currentPage changes

  useEffect(() => {
    session.status === "loading" ? setLoading(true) : setLoading(false); // Wait for session to load
    if (session.status === "unauthenticated") redirect("/"); // Redirect to login
  }, [session.status]);

  return (
    <Container
      component="div"
      className="container mx-auto p-4 flex flex-col md:flex-row gap-8"
    >
      {/* Left Sidebar (User Info) */}
      <Box component="div" className="w-full md:w-1/4">
        <Card className="mb-4">
          <CardHeader title="User Info" />
          <CardContent>
            <>
              <Typography component="p" className="mb-2">
                <strong>Name:</strong> {user?.name}
              </Typography>
              <Typography component="p" className="mb-4">
                <strong>Email:</strong> {user?.email}
              </Typography>

              <Typography component="h4" className="mb-2 font-semibold">
                Orders:
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Order ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Replace with dynamic data */}
                    <TableRow>
                      <TableCell>12345</TableCell>
                      <TableCell>Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>67890</TableCell>
                      <TableCell>Pending</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography component="h4" className="mt-4 mb-2 font-semibold">
                Gigs:
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Gig ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Gig Title</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Price</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Replace with dynamic data */}
                    <TableRow>
                      <TableCell>001</TableCell>
                      <TableCell>Logo Design</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell>$50</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>002</TableCell>
                      <TableCell>Website Development</TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell>$500</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content (Gigs) */}
      <Box component="div" className="w-full md:w-3/4">
        <Box className="mb-4">
          <Input
            type="text"
            placeholder="Search gigs by title or tags..."
            className="w-full md:w-1/2"
          />
        </Box>
        <Typography
          component="h2"
          variant="h2"
          className="text-2xl font-bold mb-4"
        >
          Gigs For You
        </Typography>
        <Box
          component={"div"}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-auto ml-auto w-max"
        >
          {gigs.map((gig: Gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}

          <Pagination
            className="mr-auto ml-auto mt-4 col-span-2"
            count={totalPages}
            defaultPage={1}
            variant="outlined"
            shape="rounded"
            page={currentPage}
            onChange={(event, value) => {
              setCurrentPage(value);
              fetchGigs(); // Fetch gigs when page changes
            }}
            color="primary"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default UserDashboard;
