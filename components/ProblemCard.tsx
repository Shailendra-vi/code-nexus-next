import { Problem } from "@/types/type";
import { Code, Pencil, Trash, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const ProblemCard = ({
  problem,
  role,
  onEdit,
  onDelete,
  onViewTestCases
}: {
  problem: Problem;
  role?: string;
  onEdit: () => void;
  onDelete: () => void;
  onViewTestCases: () => void;
}) => (
  <Card className="group relative hover:shadow-lg transition-shadow border border-gray-200 rounded-xl overflow-hidden bg-white">
    <CardHeader className={`p-5 flex items-center justify-between ${role !== "ADMIN" ? "border-none" : "border-b"}`}>
      <div className="flex items-center gap-3">
        <Code className="w-6 h-6 text-purple-600" />
        <CardTitle className="text-lg font-semibold text-gray-900">
          {problem.title}
        </CardTitle>
      </div>
    </CardHeader>

    {role === "ADMIN" && (
      <>
        <CardDescription className="px-5 pb-3 text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">
          {problem.description}
        </CardDescription>
        <CardContent className="p-5 flex gap-3 justify-center bg-gray-50 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="text-purple-600 border-purple-400 hover:bg-purple-100"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            className="hover:bg-red-600 hover:border-red-600"
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onViewTestCases}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Cases
          </Button>
        </CardContent>
      </>
    )}
  </Card>
);
