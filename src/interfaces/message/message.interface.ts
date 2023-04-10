export interface Message {
  readonly id?: number;
  readonly title: string;
  readonly content: number;
  readonly avatarUrl: string;
  readonly timestamp: number;
}
