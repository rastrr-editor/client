export interface Tool<TOption> {
  id: string;
  name: string;
  hotkey: string;
  getCursor: () => string | null;
  setOptions: (options: TOption) => void;
}
