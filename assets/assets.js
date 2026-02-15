// assets.ts — All images served directly from Cloudinary CDN
// f_auto = automatic format (WebP/AVIF), q_auto = automatic quality
// No /_next/image proxy — Cloudinary handles all optimization
const CLOUD = 'https://res.cloudinary.com/dutauqy6m/image/upload';

export const assets = {
  sliderImages: [
    `${CLOUD}/f_auto,q_auto,w_1920/utravel/slider1.png`,
    `${CLOUD}/f_auto,q_auto,w_1920/utravel/slider2.png`,
    `${CLOUD}/f_auto,q_auto,w_1920/utravel/slider3.jpg`,
    `${CLOUD}/f_auto,q_auto,w_1920/utravel/slider4.jpg`,
    `${CLOUD}/f_auto,q_auto,w_1920/utravel/slider5.jpg`,
    `${CLOUD}/f_auto,q_auto,w_1920/utravel/slider6.jpg`,
  ],
  logo: `${CLOUD}/f_auto,q_auto,w_256/utravel/logo.png`,
  tourImages: {
    gobi: `${CLOUD}/f_auto,q_auto,w_800/utravel/gobi.jpg`,
    khuvsgul: `${CLOUD}/f_auto,q_auto,w_800/utravel/khuvsgul.jpg`,
    terelj: `${CLOUD}/f_auto,q_auto,w_800/utravel/terelj.jpg`,
  },
  heroImage: `${CLOUD}/f_auto,q_auto,w_1920/utravel/gobi_Hero.jpg`,
  partnerLogo: [`${CLOUD}/f_auto,q_auto,w_400/utravel/partner1.jpg`],
};
