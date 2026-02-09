import { createRouteHandler } from "uploadthing/next";
import type { NextRequest } from "next/server";

import { ourFileRouter } from "./core";

const DEFAULT_REGION = "fra1";

function getUploadThingToken() {
  const explicit = process.env.UPLOADTHING_TOKEN?.trim();
  if (explicit) return explicit;

  const apiKey = process.env.UPLOADTHING_SECRET?.trim();
  const appId = process.env.UPLOADTHING_APP_ID?.trim();
  if (!apiKey || !appId) return undefined;

  const regionsEnv = process.env.UPLOADTHING_REGIONS ?? process.env.UPLOADTHING_REGION;
  const regions = regionsEnv
    ? regionsEnv
        .split(/[\s,]+/)
        .map((r) => r.trim().toLowerCase().replace(/_/g, "-"))
        .filter(Boolean)
    : [DEFAULT_REGION];

  const ingestHost = process.env.UPLOADTHING_INGEST_HOST?.trim();
  const payload = ingestHost ? { apiKey, appId, regions, ingestHost } : { apiKey, appId, regions };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function missingUploadThingEnv() {
  const apiKey = process.env.UPLOADTHING_SECRET?.trim();
  const appId = process.env.UPLOADTHING_APP_ID?.trim();
  const token = process.env.UPLOADTHING_TOKEN?.trim();
  return !(token || (apiKey && appId));
}

function getTokenInfo() {
  const token = getUploadThingToken();
  if (!token) return undefined;
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf8")) as {
      appId?: string;
      regions?: string[];
      ingestHost?: string;
    };
    return {
      appId: decoded.appId,
      regions: decoded.regions,
      ingestHost: decoded.ingestHost,
    };
  } catch {
    return { appId: "<invalid-token>" };
  }
}

const handler = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: getUploadThingToken(),
  },
});

async function logRequest(req: NextRequest) {
  const url = req.nextUrl;
  console.info("[uploadthing] request", {
    method: req.method,
    pathname: url.pathname,
    search: url.search,
    params: Object.fromEntries(url.searchParams.entries()),
    tokenInfo: getTokenInfo(),
  });
}

async function maybeLogErrorResponse(res: Response) {
  if (res.status < 400) return;
  try {
    const body = await res.clone().text();
    console.error("[uploadthing] error response", {
      status: res.status,
      statusText: res.statusText,
      body,
    });
  } catch (error) {
    console.error("[uploadthing] error response (failed to read body)", error);
  }
}

export const GET = async (req: NextRequest) => {
  await logRequest(req);
  if (missingUploadThingEnv()) {
    console.error("[uploadthing] Missing UploadThing env");
    return new Response("Missing UploadThing env", { status: 500 });
  }
  const res = await handler.GET(req);
  await maybeLogErrorResponse(res);
  return res;
};

export const POST = async (req: NextRequest) => {
  await logRequest(req);
  if (missingUploadThingEnv()) {
    console.error("[uploadthing] Missing UploadThing env");
    return new Response("Missing UploadThing env", { status: 500 });
  }
  const res = await handler.POST(req);
  await maybeLogErrorResponse(res);
  return res;
};
