import Phaser from 'phaser';

const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

class WikimediaServiceClass {
  private cache = new Map<string, string | null>();

  async getImageUrl(title: string, creator?: string): Promise<string | null> {
    const cacheKey = `${title}|${creator ?? ''}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const cleanTitle = title
      .replace(/\s+series$/i, '')
      .replace(/\s*\(cut-outs book\)$/i, '')
      .replace(/\s*\(.*\)$/i, '');

    let url: string | null = null;

    // Strategy 1: exact Wikipedia article title
    url = await this.fetchPageImage(WIKI_API, cleanTitle);

    // Strategy 2: disambiguation variants
    if (!url) {
      const suffixes = creator
        ? [`(${creator} painting)`, `(${creator})`, '(painting)', '(artwork)']
        : ['(painting)', '(artwork)'];
      for (const suffix of suffixes) {
        url = await this.fetchPageImage(WIKI_API, `${cleanTitle} ${suffix}`);
        if (url) break;
      }
    }

    // Strategy 3: Wikimedia Commons search (better for artwork images)
    if (!url) {
      url = await this.searchCommonsImage(cleanTitle, creator);
    }

    // Strategy 4: Wikipedia search, but skip pages about the artist themselves
    if (!url) {
      url = await this.searchAndFetchImage(cleanTitle, creator);
    }

    this.cache.set(cacheKey, url);
    return url;
  }

  private async searchCommonsImage(title: string, creator?: string): Promise<string | null> {
    try {
      const query = creator ? `${title} ${creator}` : title;
      const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: `${query} painting`,
        gsrnamespace: '6', // File namespace
        gsrlimit: '5',
        prop: 'imageinfo',
        iiprop: 'url',
        iiurlwidth: '400',
        format: 'json',
        origin: '*',
      });
      const response = await fetch(`${COMMONS_API}?${params}`);
      if (!response.ok) return null;

      const data = await response.json();
      const pages = data.query?.pages;
      if (!pages) return null;

      for (const pageId of Object.keys(pages)) {
        const page = pages[pageId];
        // Skip files that are likely portraits of the artist
        const pageTitle = (page.title || '').toLowerCase();
        if (creator && pageTitle.includes('portrait')) continue;
        if (creator && !pageTitle.includes(title.toLowerCase().split(' ')[0].toLowerCase())) continue;

        const thumbUrl = page.imageinfo?.[0]?.thumburl;
        if (thumbUrl) return thumbUrl;
      }
      return null;
    } catch {
      return null;
    }
  }

  private async searchAndFetchImage(title: string, creator?: string): Promise<string | null> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: `${title} painting artwork`,
        srnamespace: '0',
        srlimit: '5',
        format: 'json',
        origin: '*',
      });
      const response = await fetch(`${WIKI_API}?${params}`);
      if (!response.ok) return null;

      const data = await response.json();
      const results = data.query?.search;
      if (!results || results.length === 0) return null;

      for (const result of results) {
        // Skip pages that are about the artist (biography) rather than the artwork
        if (creator) {
          const resultTitle = result.title.toLowerCase();
          const creatorLower = creator.toLowerCase();
          // Skip if the result title IS the creator's name (biography page)
          if (resultTitle === creatorLower) continue;
          // Skip if it's a "Name (artist/painter)" disambiguation
          if (resultTitle.includes(creatorLower) && !resultTitle.includes(title.toLowerCase().split(' ')[0].toLowerCase())) continue;
        }

        const url = await this.fetchPageImage(WIKI_API, result.title);
        if (url) return url;
      }
      return null;
    } catch {
      return null;
    }
  }

  private async fetchPageImage(apiBase: string, title: string): Promise<string | null> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        titles: title,
        prop: 'pageimages',
        format: 'json',
        pithumbsize: '400',
        origin: '*',
      });
      const response = await fetch(`${apiBase}?${params}`);
      if (!response.ok) return null;

      const data = await response.json();
      const pages = data.query?.pages;
      if (!pages) return null;

      for (const pageId of Object.keys(pages)) {
        if (pageId === '-1') continue;
        const thumbnail = pages[pageId]?.thumbnail?.source;
        if (thumbnail) return thumbnail;
      }
      return null;
    } catch {
      return null;
    }
  }

  async loadImageIntoPhaser(scene: Phaser.Scene, key: string, url: string): Promise<boolean> {
    if (scene.textures.exists(key)) {
      this.setSmoothTexture(scene, key);
      return true;
    }

    return new Promise((resolve) => {
      scene.load.image(key, url);
      scene.load.once(`filecomplete-image-${key}`, () => {
        this.setSmoothTexture(scene, key);
        resolve(true);
      });
      scene.load.once('loaderror', () => resolve(false));
      scene.load.start();
    });
  }

  private setSmoothTexture(scene: Phaser.Scene, key: string): void {
    const texture = scene.textures.get(key);
    if (texture) {
      texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
  }
}

export const WikimediaService = new WikimediaServiceClass();
