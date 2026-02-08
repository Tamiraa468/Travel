// assets.ts
import Slider1 from './slider1.png';
import Slider2 from './slider2.png';
import Slider3 from './slider3.jpg';
import Slider4 from './slider4.jpg';
import Slider5 from './slider5.jpg';
import Slider6 from './slider6.jpg';
import logo from './logo.png';
import gobi from './gobi.jpg';
import khuvsgul from './khuvsgul.jpg';
import terelj from './terelj.jpg';
import Hero  from './gobi_Hero.jpg';
import partner1 from './partner1.jpg';

export const assets = { 
  sliderImages: [Slider1, Slider2, Slider3, Slider4, Slider5, Slider6],
  logo: logo,
  tourImages: { gobi, khuvsgul, terelj }, // keyed by name
  heroImage: Hero,
  partnerLogo: [partner1]
};
