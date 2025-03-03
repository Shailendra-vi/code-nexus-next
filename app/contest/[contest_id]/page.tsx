"use client";

import { useAuth } from "@/context/AuthContext";
import { Contest, Problem, TestCase } from "@/types/type";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  Code,
  Pencil,
  Plus,
  TestTube,
  Trash,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContestHeader } from "@/components/ContestHeader";
import { ProblemCard } from "@/components/ProblemCard";
import { TestCaseTable } from "@/components/TestCaseTable";
import { ProblemFormDialog } from "@/components/ProblemFormDialog";
import { TestCaseFormDialog } from "@/components/TestCaseFormDialog";

const ContestDetails = () => {
  const params = useParams();
  const { token, user } = useAuth();
  const contestId = params.contest_id as string;

  // State management
  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [currentProblem, setCurrentProblem] = useState<Partial<Problem>>({
    title: "",
    description: "",
  });
  const [currentTestCase, setCurrentTestCase] = useState<Partial<TestCase>>({
    input: "",
    output: "",
  });
  const [isProblemDialogOpen, setIsProblemDialogOpen] = useState(false);
  const [isTestCaseDialogOpen, setIsTestCaseDialogOpen] = useState(false);

  useEffect(() => {
    fetchContest();
    fetchProblems();
  }, [contestId, token]);

  // Fetch contest details
  const fetchContest = useCallback(async () => {
    try {
      const res = await fetch(`/api/contest/${contestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setContest(data.contest);
    } catch (error) {
      console.error("Error fetching contest:", error);
    }
  }, [contestId, token]);

  const fetchProblems = useCallback(async () => {
    try {
      const res = await fetch(`/api/problem/${contestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProblems(data.problems);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  }, [contestId, token]);

  // Problem CRUD operations
  const handleProblemSubmit = useCallback(async () => {
    try {
      const url = currentProblem.id
        ? `/api/problem/${currentProblem.id}`
        : `/api/problem/${contestId}`;
      const method = currentProblem.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentProblem),
      });

      if (res.ok) {
        setIsProblemDialogOpen(false);
        setCurrentProblem({ title: "", description: "" });

        // Refresh problems list
        const updatedProblems = await fetch(`/api/problem/${contestId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());

        setProblems(updatedProblems.problems);
      }
    } catch (error) {
      console.error("Error saving problem:", error);
    }
  }, [token, currentProblem, contestId]);

  const deleteProblem = useCallback(
    async (problemId: string) => {
      try {
        await fetch(`/api/problem/${problemId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblems(problems.filter((p) => p.id !== problemId));
      } catch (error) {
        console.error("Error deleting problem:", error);
      }
    },
    [token, problems]
  );

  // Test Case CRUD operations
  const fetchTestCases = useCallback(
    async (problemId: string) => {
      try {
        const res = await fetch(`/api/testcase/${problemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTestCases(data.testCases);
      } catch (error) {
        console.error("Error fetching test cases:", error);
      }
    },
    [token]
  );

  const handleTestCaseSubmit = useCallback(async () => {
    try {
      if (!selectedProblem) return;

      const url = currentTestCase.id
        ? `/api/testcase/${currentTestCase.id}`
        : `/api/testcase/${selectedProblem.id}`;
      const method = currentTestCase.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentTestCase,
          problem_id: selectedProblem.id,
          contest_id: contestId,
        }),
      });

      if (res.ok) {
        setIsTestCaseDialogOpen(false);
        setCurrentTestCase({ input: "", output: "" });
        fetchTestCases(selectedProblem.id);
      }
    } catch (error) {
      console.error("Error saving test case:", error);
    }
  }, [token, selectedProblem, currentTestCase, contestId]);

  const deleteTestCase = useCallback(
    async (testCaseId: string) => {
      try {
        await fetch(`/api/testcase/${testCaseId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setTestCases(testCases.filter((tc) => tc.id !== testCaseId));
      } catch (error) {
        console.error("Error deleting test case:", error);
      }
    },
    [token, testCases]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50/20 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Contest Details */}
        {contest && <ContestHeader contest={contest} role={user?.role} />}

        {/* Problems Section */}
        <Card className="shadow-2xl rounded-2xl border border-white/20 backdrop-blur-sm bg-white/70">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Problem Set
              </h2>
              {user?.role === 'ADMIN' && (
                <Button
                  onClick={() => setIsProblemDialogOpen(true)}
                  className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  Add Problem
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems?.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  role={user?.role}
                  onEdit={() => {
                    setCurrentProblem(problem);
                    setIsProblemDialogOpen(true);
                  }}
                  onDelete={() => deleteProblem(problem.id)}
                  onViewTestCases={() => {
                    setSelectedProblem(problem);
                    fetchTestCases(problem.id);
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Cases Section */}
        {user?.role === 'ADMIN' && selectedProblem && (
          <Card className="shadow-2xl rounded-2xl border border-white/20 backdrop-blur-sm bg-white/70">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TestTube className="w-6 h-6 text-purple-600" />
                  Test Cases for {selectedProblem.title}
                </h3>
                <Button
                  onClick={() => setIsTestCaseDialogOpen(true)}
                  className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  Add Test Case
                </Button>
              </div>
              <TestCaseTable
                testCases={testCases}
                onEdit={(testCase) => {
                  setCurrentTestCase(testCase);
                  setIsTestCaseDialogOpen(true);
                }}
                onDelete={deleteTestCase}
              />
            </CardContent>
          </Card>
        )}

        <ProblemFormDialog
          open={isProblemDialogOpen}
          onOpenChange={setIsProblemDialogOpen}
          problem={currentProblem}
          onSubmit={handleProblemSubmit}
          onChange={(updates) => setCurrentProblem(prev => ({ ...prev, ...updates }))}
        />

        <TestCaseFormDialog
          open={isTestCaseDialogOpen}
          onOpenChange={setIsTestCaseDialogOpen}
          testCase={currentTestCase}
          onSubmit={handleTestCaseSubmit}
          onChange={(updates) => setCurrentTestCase(prev => ({ ...prev, ...updates }))}
        />
      </div>
    </div>
  );
};

export default ContestDetails;
