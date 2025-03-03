// components/contest/TestCaseFormDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TestCase } from "@/types/type";

export const TestCaseFormDialog = ({
  open,
  onOpenChange,
  testCase,
  onSubmit,
  onChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testCase: Partial<TestCase>;
  onSubmit: () => void;
  onChange: (updates: Partial<TestCase>) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-white p-8 rounded-2xl shadow-2xl max-w-md border border-white/20">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {testCase?.id ? "Edit Test Case" : "Add Test Case"}
        </DialogTitle>
      </DialogHeader>
      <div className="mt-6 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Input</label>
          <Textarea
            placeholder="Test Case Input"
            value={testCase.input}
            onChange={(e) => onChange({ input: e.target.value })}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Output</label>
          <Textarea
            placeholder="Expected Output"
            value={testCase.output}
            onChange={(e) => onChange({ output: e.target.value })}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl font-mono"
          />
        </div>
        <Button
          onClick={onSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 px-6 py-3 rounded-xl shadow-lg transition-all"
        >
          {testCase?.id ? "Save Changes" : "Add Test Case"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);