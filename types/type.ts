interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration: number;
  creator: any
}

interface Problem {
  id: string;
  title: string;
  description: string;
  contest_id: string;
  created_by: string;
  date_created: string;
}

interface TestCase {
  id: string;
  input: string;
  output: string;
  contest_id: string;
  created_by: string;
  problem_id: string;
  date_created: string;
}

export type { User, AuthContextType, Contest, Problem, TestCase };
