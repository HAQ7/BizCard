import type { Card } from "./Card";

export interface User {
  id: string;
  email: string;
  userName: string;
  roleName: string;
  cards?: Card[]; // Optional, if user has cards
  mainCard?: Card; // Optional, if user has a main card
}
