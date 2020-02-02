const rendererWindowApi = {
   // @ts-ignore
   "closeWindow": () => window.api.closeWindow(),
   // @ts-ignore
   "minimizeWindow": () => window.api.minimizeWindow(),
   // @ts-ignore
   "appVersion": window.api.appVersion
};
export default rendererWindowApi;
