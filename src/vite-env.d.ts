/// <reference types="vite/client" />

declare module "*.bdf" {
  const content: string;
  export default content;
}
