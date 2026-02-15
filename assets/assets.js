// assets.ts — All images served from Cloudinary CDN
const CLOUD = 'https://res.cloudinary.com/dutauqy6m/image/upload';

export const assets = {
  sliderImages: [
    `${CLOUD}/utravel/slider1.png`,
    `${CLOUD}/utravel/slider2.png`,
    `${CLOUD}/utravel/slider3.jpg`,
    `${CLOUD}/utravel/slider4.jpg`,
    `${CLOUD}/utravel/slider5.jpg`,
    `${CLOUD}/utravel/slider6.jpg`,
  ],
  logo: `${CLOUD}/utravel/logo.png`,
  tourImages: {
    gobi: `${CLOUD}/utravel/gobi.jpg`,
    khuvsgul: `${CLOUD}/utravel/khuvsgul.jpg`,
    terelj: `${CLOUD}/utravel/terelj.jpg`,
  },
  heroImage: `${CLOUD}/utravel/gobi_Hero.jpg`,
  partnerLogo: [`${CLOUD}/utravel/partner1.jpg`],
};
