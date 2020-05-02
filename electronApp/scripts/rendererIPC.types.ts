const rendererWindowApi = {
   // @ts-ignore
   "closeWindow": () => window.api.closeWindow(),
   // @ts-ignore
   "minimizeWindow": () => window.api.minimizeWindow(),
   // @ts-ignore
   "appVersion": window.api.appVersion,
   // @ts-ignore
   "setFullscreen": (state: boolean) => window.api.setFullscreen(state),
   // @ts-ignore
   "openBrowserPage": (link: string) => window.api.openBrowserPage(link),
};
export default rendererWindowApi;
