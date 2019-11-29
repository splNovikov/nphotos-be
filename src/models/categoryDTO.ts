import { AlbumDTO } from './albumDTO';

class CategoryDTO {
  readonly id: string;
  readonly title: string;
  readonly cover: string;
  readonly albums?: AlbumDTO[];
}

export { CategoryDTO };
