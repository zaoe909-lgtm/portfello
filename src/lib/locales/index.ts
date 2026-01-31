import { PlaceHolderImages } from "../placeholder-images";
import en from './en';
import ar from './ar';

export const dictionaries = {
  en,
  ar
};

export type Dictionary = typeof en;


const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return {
    src: image?.imageUrl ?? `https://picsum.photos/seed/${id}/600/400`,
    hint: image?.imageHint ?? 'abstract',
  };
};


// This object is now only a fallback and will be superseded by data from Firestore.
export const profileData = {
    name: 'Alex Doe',
    title: 'Senior Flutter Developer',
    summary:
      "A passionate Senior Flutter Developer with over 5 years of experience creating beautiful, high-performance mobile applications for both iOS and Android. Proven ability to lead projects from concept to launch, delivering exceptional user experiences. Always eager to learn and apply new technologies to solve complex problems.",
    avatar: findImage('avatar'),
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  };
