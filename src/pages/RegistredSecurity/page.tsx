"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import SecurityAssignmentForm from "../EventDetail/_components/security_form";
import AddSecurityPersonModal from "../SA_DASH/_components/security_dilog";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  role: string;
}

interface RegisteredUser {
  id: string;
  userId: string;
  eventId: string;
  user: User;
}

interface ApiResponse {
  message: string;
  data: RegisteredUser[];
}

const fetchRegisteredUsers = async (eventId: string): Promise<ApiResponse> => {
  const response = await axios.get(`/event/${eventId}/security-guard`, {
    headers: {
      accept: "*/*",
    },
  });
  return response.data;
};

export default function RegisteredSecurityPage() {
  const params = useParams();
  const eventId = params?.event_id as string;

  const {
    data = { message: "", data: [] },
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["registeredUsers", eventId],
    queryFn: () => fetchRegisteredUsers(eventId),
    enabled: !!eventId,
    initialData: { message: "", data: [] },
  });

  if (isLoading) {
    return (
      <Card className="container mx-auto mt-8">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "An error occurred while fetching registered users."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="container mx-auto mt-8">
      <CardHeader className="!flex flex-row justify-between">
        <CardTitle>Registered Security Guard for Event: {eventId}</CardTitle>
        <div className="flex gap-4">
          <SecurityAssignmentForm eventId={eventId} />
          <AddSecurityPersonModal />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Middle Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(data?.data) ? (
              data.data.map((user) => (
                <TableRow key={user?.id}>
                  <TableCell className="font-medium">{user?.id}</TableCell>
                  <TableCell>{user?.userId}</TableCell>
                  <TableCell>{user?.user?.first_name}</TableCell>
                  <TableCell>{user?.user?.last_name}</TableCell>
                  <TableCell>{user?.user?.email}</TableCell>
                  <TableCell>{user?.user?.middle_name}</TableCell>
                  <TableCell>{user?.user?.role}</TableCell>
                </TableRow>
              ))
            ) : (
              <p className="text-center text-muted-foreground mt-4">
                No registered users found for this event.
              </p>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
