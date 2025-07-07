import type { User } from "./User";

export interface Card {
    id: string;
    displayName: string;
    roleName: string;
    bgColor: string; 
    textColor: string;
    email: string;
    phoneNumber?: string; 
    linkedIn?: string;
    x?: string;
    customURLName?: string;
    customURL?: string;
    owner?: User;

}