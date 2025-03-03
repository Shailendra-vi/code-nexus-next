// components/contest/TestCaseTable.tsx
import { TestCase } from "@/types/type";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

export const TestCaseTable = ({
  testCases,
  onEdit,
  onDelete,
}: {
  testCases: TestCase[];
  onEdit: (testCase: TestCase) => void;
  onDelete: (testCaseId: string) => void;
}) => (
  <Table>
    <TableHeader className="bg-gradient-to-r from-purple-600/10 to-blue-500/10">
      <TableRow className="hover:bg-transparent">
        <TableHead className="text-purple-900 font-bold">Input</TableHead>
        <TableHead className="text-purple-900 font-bold">Output</TableHead>
        <TableHead className="text-right text-purple-900 font-bold">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {testCases.map((testCase) => (
        <TableRow
          key={testCase.id}
          className="group hover:bg-purple-50/50 transition-colors"
        >
          <TableCell className="font-mono text-sm whitespace-pre-wrap">
            {testCase.input}
          </TableCell>
          <TableCell className="font-mono text-sm whitespace-pre-wrap">
            {testCase.output}
          </TableCell>
          <TableCell className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(testCase)}
              className="text-purple-600 hover:bg-purple-100"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(testCase.id)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
