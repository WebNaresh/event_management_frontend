import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import RadialChart from "./chart-map";

interface RegisteredUser {
  id: string;
  userId: string;
  eventId: string;
}

interface ApiResponse {
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    userId: string;
    registered_user: RegisteredUser[];
    checkPoints: { id: string; name: string; eventId: string }[];
    security_person: { id: string; userId: string; eventId: string }[];
  };
}

const fetchRegisteredUsers = async (eventId: string): Promise<ApiResponse> => {
  const response = await axios.get(`/event/${eventId}/insight`, {
    headers: {
      accept: "*/*",
    },
  });
  return response.data;
};

export default function RegisteredUsersChart({ eventId }: { eventId: string }) {
  const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
    queryKey: ["registeredUsers", eventId],
    queryFn: () => fetchRegisteredUsers(eventId),
  });
  console.log(`🚀 ~ file: registered_chart.tsx:39 ~ data:`, data);

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load registered users data.
        </AlertDescription>
      </Alert>
    );
  }

  const registeredUserCount = data?.data.registered_user?.length ?? 0;
  const checkPointsCount = data?.data.checkPoints?.length ?? 0;
  const securityPersonCount = data?.data.security_person?.length ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Event Insights</h3>
      <div className="flex flex-wrap gap-8">
        <Link to={`/event/${eventId}/registered-users`}>
          <RadialChart
            count={registeredUserCount}
            title="Total Registered Users"
          />
        </Link>
        <RadialChart count={checkPointsCount} title="Total CheckPoints" />
        <Link to={`/event/${eventId}/registered-security`}>
          <RadialChart
            count={securityPersonCount}
            title="Total Security Guard"
          />
        </Link>
      </div>
    </div>
  );
}
