import { ImageDTO } from './imageDTO';
import { AlbumExtraDTO } from './albumExtraDTO';

class AlbumFullDTO extends AlbumExtraDTO {
  readonly images: ImageDTO[];
}

export { AlbumFullDTO };
