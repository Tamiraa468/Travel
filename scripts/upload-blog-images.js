/**
 * Download blog cover images from cdn.yld.mn, upload to Cloudinary,
 * and update the database records.
 */

const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dutauqy6m",
  api_key: process.env.CLOUDINARY_API_KEY || "485925198688888",
  api_secret: process.env.CLOUDINARY_API_SECRET || "sf9w7M3ofRWp1kJt1AAUWDiYgug",
});

async function uploadToCloudinary(imageUrl, slug) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "utravel/blog",
      public_id: slug,
      overwrite: true,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  Upload failed for ${slug}: ${err.message}`);
    return null;
  }
}

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: {
      coverImage: { contains: "cdn.yld.mn" },
    },
    select: { id: true, title: true, slug: true, coverImage: true },
  });

  console.log(`\nFound ${posts.length} posts with cdn.yld.mn images\n`);

  let success = 0;
  let failed = 0;

  for (const post of posts) {
    console.log(`Processing: ${post.title}`);
    const newUrl = await uploadToCloudinary(post.coverImage, post.slug);

    if (newUrl) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { coverImage: newUrl },
      });
      console.log(`  ✅ Updated → ${newUrl}`);
      success++;
    } else {
      console.log(`  ❌ Skipped`);
      failed++;
    }
  }

  console.log(`\n📊 Done: ${success} uploaded, ${failed} failed\n`);
  await prisma.$disconnect();
}

main().catch(console.error);
