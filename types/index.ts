export interface Book {
  id?: number;
  title: string;
  author: string;
  publisher: string;
  medium: string;
  frontCover?: string;
  backCover?: string;
  photo_front?: string;
  photo_back?: string;
}
