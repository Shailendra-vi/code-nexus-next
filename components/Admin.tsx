"use client";

import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  Trash,
  Plus,
  Trophy,
  Info,
  Calendar,
  Clock,
} from "lucide-react";
import { Contest } from "@/types/type";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const Admin = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [currentContest, setCurrentContest] = useState<Contest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchContests();
    }
  }, [token]);

  const fetchContests = useCallback(async () => {
    try {
      const response = await fetch("/api/contest", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setContests(data.contests);
    } catch (err) {
      console.error("Failed to fetch contests:", err);
    }
  }, [token]);

  const handleSave = useCallback(async () => {
    if (!currentContest) return;
    const method = currentContest.id ? "PUT" : "POST";
    const url = currentContest.id
      ? `/api/contest/${currentContest.id}`
      : "/api/contest";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentContest),
      });

      if (response.ok) {
        fetchContests();
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("Error saving contest:", err);
    }
  }, [token, currentContest]);

  const deleteContest = useCallback(
    async (contest_id: string) => {
      try {
        await fetch(`/api/contest/${contest_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchContests();
      } catch (err) {
        console.error(err);
      }
    },
    [token]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Contest Dashboard
          </h1>
          <p className="text-gray-600">
            Manage coding competitions and challenges
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              setCurrentContest({
                id: "",
                title: "",
                description: "",
                start_time: "",
                end_time: "",
                duration: 0,
                creator: ""
              });
              setIsDialogOpen(true);
            }}
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            Create New Contest
          </Button>
        </div>

        <Card className="shadow-2xl rounded-2xl border border-white/20 backdrop-blur-sm bg-white/70">
          <CardContent className="p-2 sm:p-6">
            <Table className="w-full">
              <TableHeader className="bg-gradient-to-r from-purple-600/10 to-blue-500/10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-4 text-left font-bold text-purple-900">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Title
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-4 text-left font-bold text-purple-900">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Description
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-4 text-left font-bold text-purple-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Timeline
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-4 text-left font-bold text-purple-900">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Duration
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-4 text-right font-bold text-purple-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contests.map((contest) => (
                  <TableRow
                    key={contest.id}
                    className={cn(
                      "group hover:bg-purple-50/50 transition-colors cursor-pointer",
                      "border-b border-gray-100"
                    )}
                    onClick={() => router.push(`/contest/${contest.id}`)}
                  >
                    <TableCell className="px-4 py-4 font-medium text-purple-900">
                      {contest.title}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-600 line-clamp-2">
                      {contest.description}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge className="w-fit bg-green-100 text-green-600">
                          Starts:{" "}
                          {new Date(contest.start_time).toLocaleDateString()}
                        </Badge>
                        <Badge className="w-fit bg-red-100 text-red-600">
                          Ends:{" "}
                          {new Date(contest.end_time).toLocaleDateString()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-200"
                      >
                        {contest.duration} hours
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentContest(contest);
                            setIsDialogOpen(true);
                          }}
                          className="text-purple-600 hover:bg-purple-100 rounded-lg p-2"
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteContest(contest.id);
                          }}
                          className="text-red-600 hover:bg-red-100 rounded-lg p-2"
                        >
                          <Trash className="w-5 h-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white p-8 rounded-2xl shadow-2xl max-w-md border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {currentContest?.id ? "Edit Challenge" : "Create New Challenge"}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  placeholder="Code Masters 2024"
                  value={currentContest?.title || ""}
                  onChange={(e) =>
                    setCurrentContest((prev) => ({
                      ...prev!,
                      title: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  placeholder="Describe the contest..."
                  value={currentContest?.description || ""}
                  onChange={(e) =>
                    setCurrentContest((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Start
                  </label>
                  <Input
                    type="datetime-local"
                    value={currentContest?.start_time || ""}
                    onChange={(e) =>
                      setCurrentContest((prev) => ({
                        ...prev!,
                        start_time: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    End
                  </label>
                  <Input
                    type="datetime-local"
                    value={currentContest?.end_time || ""}
                    onChange={(e) =>
                      setCurrentContest((prev) => ({
                        ...prev!,
                        end_time: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Duration (hours)
                </label>
                <Input
                  type="number"
                  placeholder="48"
                  value={currentContest?.duration || ""}
                  onChange={(e) =>
                    setCurrentContest((prev) => ({
                      ...prev!,
                      duration: Number(e.target.value),
                    }))
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl"
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                {currentContest?.id ? "Save Changes" : "Create Contest"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
