import express from "express";
import cors from "cors";

import auth from "../routes/auth.js";
import authMiddleware from "../middleware/authMiddleware.js";
import contest from "../routes/contest.js";
import problem from "../routes/problem.js";
import testcase from "../routes/testcase.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/contest", authMiddleware, contest);
app.use("/problem", authMiddleware, problem);
app.use("/testcase", authMiddleware, testcase);



const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
