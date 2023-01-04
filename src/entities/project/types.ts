export interface ProjectMeta {
  name: string;
  preview: Blob | null;
  width: number;
  height: number;
  hasTransparentBackground: boolean;
}
