import { ImageDTO } from './image';

class AlbumDTO {
  readonly id: string;
  readonly title: string;
  readonly cover: string;
  readonly images?: ImageDTO[];
}

export { AlbumDTO };
