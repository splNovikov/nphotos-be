import { ImageDTO } from './imageDTO';

class AlbumDTO {
  readonly id: string;
  readonly title: string;
  readonly titleRus: string;
  readonly titleEng: string;
  readonly cover: string;
  readonly images?: ImageDTO[];
}

export { AlbumDTO };
