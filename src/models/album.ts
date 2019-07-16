import { Image } from './image';

interface Album {
  id: string;
  title: string;
  images?: Image[];
}

export { Album };
