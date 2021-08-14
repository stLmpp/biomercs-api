import { Injectable } from '@nestjs/common';
import { UrlMetadataViewModel } from './url-metadata.view-model';
import metadataScraper from 'metadata-scraper';
import normalizeUrl from 'normalize-url';

@Injectable()
export class UrlMetadataService {
  async getMetadata(url: string): Promise<UrlMetadataViewModel> {
    url = normalizeUrl(url);
    try {
      const metaData = await metadataScraper(url, {});
      return new UrlMetadataViewModel({
        url: metaData.url ?? url,
        description: metaData.description ?? '',
        image: metaData.image ?? '',
        title: metaData.title ?? '',
        domain: new URL(url).hostname,
      });
    } catch (error) {
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
