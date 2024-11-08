export interface Video {
  id: string;
  title: string;
  url: string;
  tags: { [key: string]: string[] };
}

export interface Tag {
  name: string;
  active: boolean;
}