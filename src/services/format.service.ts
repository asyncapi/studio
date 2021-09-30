export class FormatService {
  static retrieveLangauge(content: string) {
    if (content.trim()[0] === '{') {
      return 'json';
    }
    return 'yaml';
  }
}
