import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "Maralgoo Dreamland",
          tagline: "Discover the Land of the Blue Sky",
          email: "info@maralgoodreamland.mn",
          phone: "+976 99080061",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/settings error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT update site settings (admin)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      siteName,
      tagline,
      email,
      phone,
      address,
      facebookUrl,
      instagramUrl,
      whatsappNumber,
      twitterUrl,
      youtubeUrl,
      linkedinUrl,
    } = body;

    let settings = await prisma.siteSettings.findFirst();

    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          siteName,
          tagline,
          email,
          phone,
          address,
          facebookUrl,
          instagramUrl,
          whatsappNumber,
          twitterUrl,
          youtubeUrl,
          linkedinUrl,
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          siteName,
          tagline,
          email,
          phone,
          address,
          facebookUrl,
          instagramUrl,
          whatsappNumber,
          twitterUrl,
          youtubeUrl,
          linkedinUrl,
        },
      });
    }

    return NextResponse.json({ ok: true, data: settings });
  } catch (error) {
    console.error("PUT /api/settings error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
