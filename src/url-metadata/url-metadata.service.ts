import { Injectable } from '@nestjs/common';
import { UrlMetadataViewModel } from './url-metadata.view-model';
import * as urlMetadata from 'url-metadata';
import * as normalizeUrl from 'normalize-url';
import { environment } from '../environment/environment';

@Injectable()
export class UrlMetadataService {
  async getMetadata(url: string): Promise<UrlMetadataViewModel> {
    url = normalizeUrl(url);
    try {
      const rawMetadata = await urlMetadata(url, { fromEmail: environment.get('MAIL') });
      return new UrlMetadataViewModel({
        url: rawMetadata.url ?? rawMetadata['og:url'],
        description: rawMetadata.description ?? rawMetadata['og:description'],
        image: rawMetadata.image ?? rawMetadata['og:image'] ?? rawMetadata['twitter:image'],
        title: rawMetadata.title ?? rawMetadata['og:title'] ?? rawMetadata['twitter:title'],
        domain: new URL(url).hostname,
      });
    } catch {
      return new UrlMetadataViewModel({
        url,
        description: 'Failed to load preview',
        image: null,
        title: 'Failed to load preview',
        domain: new URL(url).hostname,
      });
    }
  }
}
