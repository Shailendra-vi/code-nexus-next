import { useAuth } from "@/context/AuthContext";
import { Contest } from "@/types/type";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Clock, User as UserIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const User = () => {
  const { token } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchAllContests();
  }, [token]);

  const fetchAllContests = async () => {
    try {
      const res = await fetch(`/api/contest`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const body = await res.json();
      setContests(body.contests);
    } catch (err: any) {
      console.log("Error: ", err.message);
    }
  };

  const getContestStatus = (start: string, end: string) => {
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);
    
    if (now < startTime) return "Upcoming";
    if (now > endTime) return "Ended";
    return "Ongoing";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Coding Contests
          </h1>
          <p className="text-gray-600">
            Participate in exciting programming challenges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => {
            const status = getContestStatus(contest.start_time, contest.end_time);
            
            return (
              <Card 
                key={contest.id} 
                className="shadow-lg rounded-xl hover:shadow-xl transition-shadow bg-white/70 backdrop-blur-sm"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-purple-900">
                      {contest.title}
                    </h3>
                    <Badge className={cn(
                      "text-sm",
                      status === "Upcoming" && "bg-blue-100 text-blue-600",
                      status === "Ongoing" && "bg-green-100 text-green-600",
                      status === "Ended" && "bg-red-100 text-red-600"
                    )}>
                      {status}
                    </Badge>
                  </div>

                  <p className="text-gray-600 line-clamp-3 text-sm">
                    {contest.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(contest.start_time).toLocaleDateString()} - {" "}
                        {new Date(contest.end_time).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{contest.duration} hours duration</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <UserIcon className="w-4 h-4" />
                      <span>Hosted by {contest.creator.name}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push(`/contest/${contest.id}`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                    disabled={status === "Ended"}
                  >
                    {status === "Ended" ? "Contest Ended" : "Enter Contest"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default User;