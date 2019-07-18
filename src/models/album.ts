import { Image } from './image';

interface Album {
  id: string;
  title: string;
  cover?: string;
  images?: Image[];
}

export { Album };
