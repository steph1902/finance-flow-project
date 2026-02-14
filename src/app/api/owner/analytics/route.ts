import { NextResponse } from "next/server";

// Mock analytics data - in production, query from Analytics table
export async function GET(request: Request) {
  try {
    // Simulate fetching analytics from database
    const stats = {
      totalUsers: 147,
      activeUsers: {
        last7Days: 42,
        last30Days: 89,
      },
      featureUsage: {
        transactions: 1543,
        budgets: 234,
        goals: 156,
        big4Analyses: 67,
        aiCategorizations: 1298,
      },
      geographic: [
        { country: "United States", users: 52 },
        { country: "Japan", users: 31 },
        { country: "United Kingdom", users: 18 },
        { country: "Canada", users: 14 },
        { country: "Germany", users: 11 },
        { country: "France", users: 9 },
        { country: "Australia", users: 7 },
        { country: "Singapore", users: 5 },
      ],
      systemHealth: {
        apiCalls: 4521,
        avgResponseTime: 287,
        errorRate: 0.42,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
