import { AlbumDTO } from './albumDTO';

class CategoryDTO {
  readonly id: string;
  readonly title: string;
  readonly title_rus: string;
  readonly title_eng: string;
  readonly cover: string;
  readonly albums?: AlbumDTO[];
}

export { CategoryDTO };
