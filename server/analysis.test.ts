import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Dashboard Stats", () => {
  it("should return dashboard statistics", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.dashboard.stats();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalDocuments");
    expect(stats).toHaveProperty("totalAnalyses");
    expect(stats).toHaveProperty("completedAnalyses");
    expect(stats).toHaveProperty("avgPlagiarismPercentage");
    expect(stats).toHaveProperty("avgAIPercentage");
    expect(typeof stats.totalDocuments).toBe("number");
    expect(typeof stats.avgPlagiarismPercentage).toBe("number");
  });
});

describe("Document Operations", () => {
  it("should list user documents", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const documents = await caller.documents.list();

    expect(Array.isArray(documents)).toBe(true);
  });
});

describe("Analysis Operations", () => {
  it("should list user analyses", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const analyses = await caller.analysis.list();

    expect(Array.isArray(analyses)).toBe(true);
  });
});
