import { env } from "@/services/config";
import logger from "@/services/logger";
import { getPineconeClient } from "@/services/pinecone-client";
import arcjet, { shield, tokenBucket } from "@arcjet/next";
import { type NextRequest, NextResponse } from "next/server";

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    tokenBucket({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      characteristics: ["sessionId"],
      refillRate: 1,
      interval: 7200,
      capacity: 5,
    }),
    shield({
      mode: "DRY_RUN",
    }),
  ],
});

export async function DELETE(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const sessionId = searchParams.get("sessionId") || "";
  const fileName = searchParams.get("fileName") || "";

  if (!sessionId || !fileName) {
    return NextResponse.json(
      { error: "Bad Request", reason: "Missing sessionId or fileName" },
      { status: 400 }
    );
  }

  const decision = await aj.protect(req, { sessionId, requested: 1 });
  logger.info("Arcjet decision", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests", reason: decision.reason },
      { status: 429 }
    );
  }

  try {
    const pinecone = await getPineconeClient();
    const index = pinecone.index(env.PINECONE_INDEX_NAME);

    // Delete vectors with matching metadata
    await index.deleteMany({
      filter: {
        fileName: fileName,
        sessionId: sessionId,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file from Pinecone:", error);
    return NextResponse.json(
      { error: "Internal Server Error", reason: "Failed to delete file" },
      { status: 500 }
    );
  }
} 