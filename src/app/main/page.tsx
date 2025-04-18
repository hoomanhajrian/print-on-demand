"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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

const GIGS_PER_PAGE = 6; // Number of gigs per page

const UserDashboard = () => {
  const allGigs = useRef<Gig[]>([]); // Original fetched gigs
  const [filteredGigs, setFilteredGigs] = useState<Gig[][]>([]); // Gigs to display on the front end
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term for filtering
  const [userOrders, setUserOrders] = useState([]); // User orders state
  const [userGigs, setUserGigs] = useState([]); // User gigs state

  const session = useSession();

  // Extract user information from the session
  const user = session?.data?.user || null;

  // If no session or user, prompt the user to log in
  if (!user) {
    redirect("/");
  }

  const fetchOrders = async () => {}; // Placeholder for fetching user orders

  // Fetch gigs from the API
  const fetchGigs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/gigs`);
      if (!response.ok) throw new Error("Failed to fetch gigs");

      const fetchedData: { gigs: Gig[] } = await response.json();
      allGigs.current = fetchedData.gigs; // Set the original fetched gigs
      console.log("Fetched gigs:", allGigs.current); // Log the fetched gigs
      setFilteredGigs(paginateGigs(allGigs.current)); // Paginate the fetched gigs
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const paginateGigs = (gigsList: Gig[]) => {
    setCurrentPage(1); // Reset current page to 1
    const paginatedGigs: Gig[][] = []; // Array to hold paginated gigs
    const totalPages = Math.ceil(gigsList.length / GIGS_PER_PAGE); // Calculate total pages

    for (let i = 0; i < totalPages; i++) {
      const startIndex = i * GIGS_PER_PAGE;
      const endIndex = startIndex + GIGS_PER_PAGE;
      paginatedGigs.push(gigsList.slice(startIndex, endIndex));
    }

    setTotalPages(totalPages); // Update total pages state
    return paginatedGigs; // Return the paginated gigs
  };
  // Fetch gigs when the component mounts
  useEffect(() => {
    fetchGigs();
  }, []);

  // Update filtered gigs when `currentPage` or `searchTerm` changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages); // Ensure current page is not greater than total pages
    if (allGigs.current.length === 0) return; // If no gigs, do nothing

    if (searchTerm === "") {
      // If no search term, paginate all gigs
      setFilteredGigs(paginateGigs(allGigs.current));
    } else {
      // Filter gigs by search term
      const filtered = allGigs.current.filter((gig: Gig) =>
        gig.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGigs(paginateGigs(filtered)); // Paginate the filtered gigs
    }
  }, [searchTerm, allGigs]);

  // Handle session status
  useEffect(() => {
    session.status === "loading" ? setLoading(true) : setLoading(false); // Wait for session to load
    if (session.status === "unauthenticated") redirect("/"); // Redirect to login
  }, [session.status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h4">Fetching gigs...</Typography>
      </div>
    );
  }

  return (
    <Container
      component="div"
      className="container mx-auto p-4 flex flex-col w-full gap-4"
    >
      {/* Left Sidebar (User Info) */}
      <Box component="div" className="w-full">
        <Card className="mb-4">
          <CardHeader title={`${user?.name} Dashboard`} />
          <CardContent>
            <>
              <Typography component="h4" className="mb-2 font-semibold">
                Orders:
              </Typography>
              <TableContainer component={Paper}>
                {userOrders.length > 0 ? (
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
                      {userOrders.map(() => {
                        return (
                          <TableRow>
                            <TableCell>67890</TableCell>
                            <TableCell>Pending</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography>No orders found.</Typography>
                )}
              </TableContainer>

              <Typography component="h4" className="mt-4 mb-2 font-semibold">
                Gigs:
              </Typography>
              <TableContainer component={Paper}>
                {userGigs.length > 0 ? (
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
                      {userGigs.map(() => {
                        return (
                          <TableRow>
                            <TableCell>001</TableCell>
                            <TableCell>Logo Design</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>$50</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography>No gigs found.</Typography>
                )}
              </TableContainer>
            </>
          </CardContent>
        </Card>
      </Box>
      {/* Search Input */}
      <Box component="div" className="w-full">
        <Box className="mb-4">
          <Input
            type="text"
            placeholder="Search gigs by title..."
            className="w-full md:w-1/2"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              console.log(e.target.value);
              setSearchTerm(e.target.value);
            }}
          />
        </Box>
        {/* Gigs List */}
        <Typography variant="h4" className="mb-4">
          Gigs for you
        </Typography>
        <Box
          component={"div"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mr-auto ml-auto"
        >
          <Pagination
            className="mt-4 mr-auto ml-auto col-span-1 md:col-span-2 lg:col-span-3"
            count={totalPages} // Total pages
            page={currentPage} // Current page
            onChange={(_, page) => setCurrentPage(page)} // Update current page
            variant="outlined"
            shape="rounded"
          />
          {filteredGigs &&
          filteredGigs.length > 0 &&
          filteredGigs[currentPage - 1] ? (
            filteredGigs[currentPage - 1].map((gig: Gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))
          ) : (
            <Typography>No gigs found.</Typography>
          )}
          {/* Pagination */}
          <Pagination
            className="mt-4 mr-auto ml-auto col-span-1 md:col-span-2 lg:col-span-3"
            count={totalPages} // Total pages
            page={currentPage} // Current page
            onChange={(_, page) => setCurrentPage(page)} // Update current page
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default UserDashboard;
