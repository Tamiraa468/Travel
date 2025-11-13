// assets.ts
import Slider1 from './slider1.png';
import Slider2 from './slider2.png';
import logo from './logo.png';
import gobi from './gobi.jpg';
import khuvsgul from './khuvsgul.jpg';
import terelj from './terelj.jpg';
import Hero  from './gobi_Hero.jpg';

export const assets = { 
  sliderImages: [Slider1, Slider2],
  logo: logo,
  tourImages: { gobi, khuvsgul, terelj }, // keyed by name
  heroImage: Hero,
};
