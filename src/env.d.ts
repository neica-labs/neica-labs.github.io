/// <reference types="vite/client" />
declare module "virtual:neica-catalog" {
  const catalogs: import("./types").LocalizedCatalog;
  export default catalogs;
}
