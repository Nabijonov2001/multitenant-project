export interface ICurrentUser {
  id: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  lang;
}
