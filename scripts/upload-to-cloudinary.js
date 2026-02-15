const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: 'dutauqy6m',
  api_key: '485925198688888',
  api_secret: 'sf9w7M3ofRWp1kJt1AAUWDiYgug',
});

const assets = [
  // Assets folder images
  { file: '../assets/slider1.png', public_id: 'utravel/slider1', folder: '' },
  { file: '../assets/slider2.png', public_id: 'utravel/slider2', folder: '' },
  { file: '../assets/slider3.jpg', public_id: 'utravel/slider3', folder: '' },
  { file: '../assets/slider4.jpg', public_id: 'utravel/slider4', folder: '' },
  { file: '../assets/slider5.jpg', public_id: 'utravel/slider5', folder: '' },
  { file: '../assets/slider6.jpg', public_id: 'utravel/slider6', folder: '' },
  { file: '../assets/logo.png', public_id: 'utravel/logo', folder: '' },
  { file: '../assets/gobi.jpg', public_id: 'utravel/gobi', folder: '' },
  { file: '../assets/khuvsgul.jpg', public_id: 'utravel/khuvsgul', folder: '' },
  { file: '../assets/terelj.jpg', public_id: 'utravel/terelj', folder: '' },
  { file: '../assets/gobi_Hero.jpg', public_id: 'utravel/gobi_Hero', folder: '' },
  { file: '../assets/partner1.jpg', public_id: 'utravel/partner1', folder: '' },
  { file: '../assets/tours.webp', public_id: 'utravel/tours', folder: '' },
  // Partner SVGs from public
  { file: '../public/partners/blue-sky-bank.svg', public_id: 'utravel/partners/blue-sky-bank', folder: '' },
  { file: '../public/partners/eagle-outfitters.svg', public_id: 'utravel/partners/eagle-outfitters', folder: '' },
  { file: '../public/partners/ger-camp-group.svg', public_id: 'utravel/partners/ger-camp-group', folder: '' },
  { file: '../public/partners/horizon-logistics.svg', public_id: 'utravel/partners/horizon-logistics', folder: '' },
  { file: '../public/partners/nomad-air.svg', public_id: 'utravel/partners/nomad-air', folder: '' },
  { file: '../public/partners/steppe-hotels.svg', public_id: 'utravel/partners/steppe-hotels', folder: '' },
  // Public SVGs
  { file: '../public/file.svg', public_id: 'utravel/file', folder: '' },
  { file: '../public/globe.svg', public_id: 'utravel/globe', folder: '' },
  { file: '../public/next.svg', public_id: 'utravel/next', folder: '' },
  { file: '../public/vercel.svg', public_id: 'utravel/vercel', folder: '' },
  { file: '../public/window.svg', public_id: 'utravel/window', folder: '' },
];

async function uploadAll() {
  const results = {};
  
  for (const asset of assets) {
    const filePath = path.resolve(__dirname, asset.file);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: asset.public_id,
        overwrite: true,
        resource_type: 'auto',
      });
      results[asset.public_id] = result.secure_url;
      console.log(`✅ ${asset.public_id} → ${result.secure_url}`);
    } catch (err) {
      console.error(`❌ ${asset.public_id}: ${err.message}`);
    }
  }
  
  console.log('\n\n=== RESULTS JSON ===');
  console.log(JSON.stringify(results, null, 2));
}

uploadAll();
