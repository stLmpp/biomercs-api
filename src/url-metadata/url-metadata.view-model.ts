import { Property } from '../mapper/property.decorator';

export class UrlMetadataViewModel {
  constructor(properties?: UrlMetadataViewModel) {
    Object.assign(this, properties);
  }

  @Property() domain!: string;
  @Property() title!: string;
  @Property() description!: string;
  @Property() image!: string | null;
  @Property() url!: string;
}
