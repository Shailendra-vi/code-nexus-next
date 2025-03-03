import { Contest } from "@/types/type";
import { Trophy, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const ContestHeader = ({ contest, role }: { contest: Contest; role?: string }) => (
  <Card className="shadow-xl rounded-3xl border border-white/20 backdrop-blur-lg bg-white/40 p-6 overflow-hidden">
    <CardHeader className="bg-gradient-to-br from-indigo-600 to-purple-500 p-10 rounded-3xl text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 blur-3xl" />
      <CardTitle className="text-5xl font-extrabold flex items-center gap-4 relative z-10">
        <Trophy className="w-10 h-10 text-yellow-400" />
        {contest.title}
      </CardTitle>
      <CardDescription className="text-white/80 text-lg mt-3 relative z-10">
        {contest.description}
      </CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      <div className="flex flex-col items-center gap-2 bg-white/50 p-4 rounded-xl shadow-md">
        <Badge className="bg-green-500 text-white px-4 py-2 flex items-center gap-2 rounded-lg text-sm">
          <Calendar className="w-5 h-5" /> Start Time
        </Badge>
        <p className="text-lg font-semibold text-gray-800">
          {new Date(contest.start_time).toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 bg-white/50 p-4 rounded-xl shadow-md">
        <Badge className="bg-red-500 text-white px-4 py-2 flex items-center gap-2 rounded-lg text-sm">
          <Calendar className="w-5 h-5" /> End Time
        </Badge>
        <p className="text-lg font-semibold text-gray-800">
          {new Date(contest.end_time).toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 bg-white/50 p-4 rounded-xl shadow-md">
        <Badge className="bg-blue-500 text-white px-4 py-2 flex items-center gap-2 rounded-lg text-sm">
          <Clock className="w-5 h-5" /> Duration
        </Badge>
        <p className="text-lg font-semibold text-gray-800">
          {contest.duration} hours
        </p>
      </div>
      {role === 'USER' && (
        <div className="col-span-full flex justify-center">
          <Button className="bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 text-white px-10 py-4 rounded-2xl text-xl font-semibold shadow-md transition-all">
            Start Challenge
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);