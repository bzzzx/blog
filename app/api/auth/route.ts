import { NextResponse } from "next/server";

/**
 * Initiates GitHub OAuth flow for Decap CMS authentication.
 * Redirects the user to GitHub to authorize the CMS.
 *
 * Environment variables required:
 * - GITHUB_OAUTH_CLIENT_ID: GitHub OAuth App client ID
 */
export async function GET() {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub OAuth client ID not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: "repo,user",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
