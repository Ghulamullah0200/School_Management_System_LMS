import type { Express } from "express";
import { type Server } from "http";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import studentRoutes from "./routes/student";
import teacherRoutes from "./routes/teacher";
import subjectRoutes from "./routes/subject";
import classRoutes from "./routes/class";
import examRoutes from "./routes/exam";
import accountingRoutes from "./routes/accounting";
import transportRoutes from "./routes/transport";
import hostelRoutes from "./routes/hostel";
import messageRoutes from "./routes/message";
import settingsRoutes from "./routes/settings";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);

  // School Management Modules
  app.use("/api/students", studentRoutes);
  app.use("/api/teachers", teacherRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/classes", classRoutes);
  app.use("/api/exams", examRoutes);
  app.use("/api/accounting", accountingRoutes);
  app.use("/api/transport", transportRoutes);
  app.use("/api/hostel", hostelRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/settings", settingsRoutes);

  return httpServer;
}
