import { AlbumExtraDTO } from './albumExtraDTO';

class CategoryDTO {
  readonly id: string;
  readonly title: string;
  readonly titleRus: string;
  readonly titleEng: string;
  readonly cover: string;
  readonly albums?: AlbumExtraDTO[];
  readonly albumsCount?: number;
}

export { CategoryDTO };
