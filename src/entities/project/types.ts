export interface Project {
  name: string;
  preview: Blob | null;
  width: number;
  height: number;
  isTransparent: boolean;
}
