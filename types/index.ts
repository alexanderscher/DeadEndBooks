import { Session, User } from "next-auth";

export interface Book {
  id?: number;
  title: string;
  author: string;
  publisher: string;
  medium: string;
  inStock?: boolean;
  frontCover?: string;
  backCover?: string;
  photo_front?: string;
  photo_back?: string;
  savedId?: number;
  cartId?: number;
  people?: number;
  current?: boolean;
  userId?: number;
  stockStatus?: string;
}

export type UserType = {
  id: number;
  admin: boolean;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  stripeCustomerId?: string | null | undefined;
  subscriptionID: string | null | undefined;
  isActive: boolean;
};

export interface ExtendedUser extends User {
  id: string;
  admin: boolean;
  stripeCustomerId: string;
  subscriptionID: string;
  isActive: boolean;
}

export interface ExtendedSession extends Session {
  user: ExtendedUser;
}
