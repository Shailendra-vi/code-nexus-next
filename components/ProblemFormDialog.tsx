// components/contest/ProblemFormDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Problem } from "@/types/type";

export const ProblemFormDialog = ({
  open,
  onOpenChange,
  problem,
  onSubmit,
  onChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem: Partial<Problem>;
  onSubmit: () => void;
  onChange: (updates: Partial<Problem>) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-white p-8 rounded-2xl shadow-2xl max-w-md border border-white/20">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {problem?.id ? "Edit Problem" : "Create Problem"}
        </DialogTitle>
      </DialogHeader>
      <div className="mt-6 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <Input
            placeholder="Problem Title"
            value={problem.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <Textarea
            placeholder="Problem Description"
            value={problem.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={5}
            className="w-full p-3 border border-gray-200 rounded-xl"
          />
        </div>
        <Button
          onClick={onSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 px-6 py-3 rounded-xl shadow-lg transition-all"
        >
          {problem?.id ? "Save Changes" : "Create Problem"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);