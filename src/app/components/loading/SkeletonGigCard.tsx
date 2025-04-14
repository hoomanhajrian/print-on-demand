"use client";
import { Card, CardContent, CardHeader, Skeleton, Box } from "@mui/material";

export const SkeletonGigCard = () => {
  return (
    <Card className="mb-4">
      <CardHeader
        title={<Skeleton variant="text" width="60%" />}
        subheader={<Skeleton variant="text" width="40%" />}
      />
      <CardContent>
        <Skeleton variant="text" width="80%" className="mb-2" />
        <Skeleton variant="text" width="90%" className="mb-2" />
        <Box className="flex flex-wrap gap-2">
          <Skeleton variant="rectangular" width={60} height={24} />
          <Skeleton variant="rectangular" width={60} height={24} />
          <Skeleton variant="rectangular" width={60} height={24} />
        </Box>
      </CardContent>
    </Card>
  );
};
