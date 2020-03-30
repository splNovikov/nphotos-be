import { CategoryShortDTO } from './categoryShortDTO';
import { AlbumDTO } from './AlbumDTO';

class AlbumExtraDTO extends AlbumDTO {
  readonly categories: CategoryShortDTO[];
  readonly imagesCount: number;
}

export { AlbumExtraDTO };
