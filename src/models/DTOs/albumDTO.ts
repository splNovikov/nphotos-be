import { ImageDTO } from './imageDTO';
import { CategoryShortDTO } from './categoryShortDTO';

class AlbumDTO {
  readonly id: string;
  readonly title: string;
  readonly titleRus: string;
  readonly titleEng: string;
  readonly cover: string;
  readonly images?: ImageDTO[];
  // just for extra info
  readonly categories?: CategoryShortDTO[];
  readonly imagesCount?: number;
}

export { AlbumDTO };
