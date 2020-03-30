import { CategoryShortDTO } from './categoryShortDTO';
import { AlbumDTO } from './albumDTO';

class AlbumExtraDTO extends AlbumDTO {
  readonly categories: CategoryShortDTO[];
  readonly imagesCount: number;
}

export { AlbumExtraDTO };
