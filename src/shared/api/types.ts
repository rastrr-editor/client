import type { LayerData } from '@rastrr-editor/core';

export interface Project {
  id?: number;
  name: string;
  preview: Blob | null;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date | null;
  layers: LayerData[];
}
