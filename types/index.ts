import { Session, User } from "next-auth";

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

export type UserType = {
  id: number;
  admin: boolean;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export interface ExtendedUser extends User {
  id: string;
  admin: boolean;
}

export interface ExtendedSession extends Session {
  user: ExtendedUser;
}
