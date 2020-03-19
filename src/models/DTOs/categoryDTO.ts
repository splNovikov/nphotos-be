import { AlbumDTO } from './albumDTO';

class CategoryDTO {
  readonly id: string;
  readonly title: string;
  readonly titleRus: string;
  readonly titleEng: string;
  readonly cover: string;
  readonly albums?: AlbumDTO[];
  readonly albumsCount?: number;
}

export { CategoryDTO };
