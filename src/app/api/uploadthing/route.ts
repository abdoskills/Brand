import { createRouteHandler } from "uploadthing/next";
import type { NextRequest } from "next/server";
 
import { ourFileRouter } from "./core";
 
function getUploadThingToken() {
  const explicit = process.env.UPLOADTHING_TOKEN?.trim();
  if (explicit) return explicit;

  const apiKey = process.env.UPLOADTHING_SECRET?.trim();
  const appId = process.env.UPLOADTHING_APP_ID?.trim();
  if (!apiKey || !appId) return undefined;

  const regionsEnv = process.env.UPLOADTHING_REGIONS ?? process.env.UPLOADTHING_REGION;
  if (!regionsEnv) return undefined;
  const regions = regionsEnv
    .split(/[\s,]+/)
    .map((r) => r.trim().toLowerCase().replace(/_/g, "-"))
    .filter(Boolean);
  if (!regions.length) return undefined;

  const ingestHost = process.env.UPLOADTHING_INGEST_HOST?.trim();
  const payload = ingestHost ? { apiKey, appId, regions, ingestHost } : { apiKey, appId, regions };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function missingUploadThingEnv() {
  const apiKey = process.env.UPLOADTHING_SECRET?.trim();
  const appId = process.env.UPLOADTHING_APP_ID?.trim();
  const token = process.env.UPLOADTHING_TOKEN?.trim();
  const regions = process.env.UPLOADTHING_REGIONS ?? process.env.UPLOADTHING_REGION;
  return !(token || (apiKey && appId && regions));
}

const handler = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: getUploadThingToken(),
  },
});

async function logRequest(req: NextRequest) {
  const url = req.nextUrl;
  const token = getUploadThingToken();
  let tokenInfo: { appId?: string; regions?: string[]; ingestHost?: string; apiKeyPrefix?: string } | undefined;
  if (token) {
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf8")) as {
        apiKey?: string;
        appId?: string;
        regions?: string[];
        ingestHost?: string;
      };
      tokenInfo = {
        appId: decoded.appId,
        regions: decoded.regions,
        ingestHost: decoded.ingestHost,
        apiKeyPrefix: decoded.apiKey ? decoded.apiKey.slice(0, 6) : undefined,
      };
    } catch {
      tokenInfo = { apiKeyPrefix: "<invalid-token>" };
    }
  }
  console.info("[uploadthing] request", {
    method: req.method,
    url: url.toString(),
    pathname: url.pathname,
    search: url.search,
    params: Object.fromEntries(url.searchParams.entries()),
    tokenInfo,
  });
  console.info("[uploadthing] env", {
    hasToken: Boolean(process.env.UPLOADTHING_TOKEN?.trim()),
    hasSecret: Boolean(process.env.UPLOADTHING_SECRET?.trim()),
    hasAppId: Boolean(process.env.UPLOADTHING_APP_ID?.trim()),
    regions: process.env.UPLOADTHING_REGIONS ?? process.env.UPLOADTHING_REGION,
    ingestHost: process.env.UPLOADTHING_INGEST_HOST,
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
