/**
 * One-time migration script: Upload base64 mainImage → Cloudinary, store URL in mainImageUrl.
 *
 * Usage:
 *   npx tsx scripts/migrate-images-to-cloudinary.ts
 *   npx tsx scripts/migrate-images-to-cloudinary.ts --clear   (also clears base64 after migration)
 *
 * Safe to re-run — skips tours that already have mainImageUrl set.
 */

import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

// ── Config ──────────────────────────────────────────────────────────────────
const BATCH_SIZE = 5;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2_000;
const CLOUDINARY_FOLDER = "utravel/tours";
const CLEAR_BASE64 = process.argv.includes("--clear");

// ── Init ────────────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dutauqy6m",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const prisma = new PrismaClient();

// ── Helpers ─────────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function uploadWithRetry(
  dataUri: string,
  publicId: string,
  retries = MAX_RETRIES,
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        public_id: publicId,
        folder: CLOUDINARY_FOLDER,
        overwrite: false, // don't re-upload if already exists
        resource_type: "image",
      });
      return result.secure_url;
    } catch (err: any) {
      console.error(
        `  ⚠ Upload attempt ${attempt}/${retries} failed: ${err.message}`,
      );
      if (attempt < retries) await sleep(RETRY_DELAY_MS * attempt);
      else throw err;
    }
  }
  throw new Error("unreachable");
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔍 Finding tours with base64 mainImage and no mainImageUrl...");

  const tours = await prisma.tour.findMany({
    where: {
      mainImageUrl: null,
      mainImage: { not: null },
    },
    select: { id: true, slug: true, mainImage: true },
  });

  // Filter to only base64 entries
  const toMigrate = tours.filter(
    (t) => t.mainImage && t.mainImage.startsWith("data:image"),
  );

  console.log(
    `📦 Found ${toMigrate.length} tours to migrate (out of ${tours.length} without mainImageUrl)`,
  );

  if (toMigrate.length === 0) {
    console.log("✅ Nothing to do — all tours already migrated.");
    return;
  }

  let succeeded = 0;
  let failed = 0;

  // Process in batches
  for (let i = 0; i < toMigrate.length; i += BATCH_SIZE) {
    const batch = toMigrate.slice(i, i + BATCH_SIZE);
    console.log(
      `\n── Batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} tours) ──`,
    );

    await Promise.all(
      batch.map(async (tour) => {
        const publicId = tour.slug || tour.id;
        try {
          console.log(`  ⬆ Uploading: ${publicId}`);
          const url = await uploadWithRetry(tour.mainImage!, publicId);

          const updateData: Record<string, any> = { mainImageUrl: url };
          if (CLEAR_BASE64) {
            updateData.mainImage = null;
          }

          await prisma.tour.update({
            where: { id: tour.id },
            data: updateData,
          });

          console.log(`  ✅ ${publicId} → ${url}`);
          succeeded++;
        } catch (err: any) {
          console.error(`  ❌ ${publicId}: ${err.message}`);
          failed++;
        }
      }),
    );
  }

  console.log(`\n════════════════════════════════════════`);
  console.log(`✅ Succeeded: ${succeeded}`);
  console.log(`❌ Failed:    ${failed}`);
  console.log(`📊 Total:     ${toMigrate.length}`);
  if (CLEAR_BASE64 && succeeded > 0) {
    console.log(`🧹 Base64 data cleared for migrated tours`);
  }
  console.log(`════════════════════════════════════════\n`);
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
