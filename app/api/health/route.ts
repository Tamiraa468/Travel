/**
 * Health Check API
 * 
 * Use this to monitor your application and database status
 * URL: GET /api/health
 */

import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connection
    const dbConnected = await checkDatabaseConnection();
    const responseTime = Date.now() - startTime;
    
    if (dbConnected) {
      return NextResponse.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "connected",
          api: "running",
        },
        responseTime: `${responseTime}ms`,
        environment: process.env.NODE_ENV,
      });
    } else {
      return NextResponse.json(
        {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          services: {
            database: "disconnected",
            api: "running",
          },
          responseTime: `${responseTime}ms`,
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 }
    );
  }
}
