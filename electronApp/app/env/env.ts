export const urlsPath = {
   getDefaultAvatar: () => `http://localhost:8000/api/users/avatars/server.png`,
   getUserAvatar: (hash: string) => `http://localhost:8000/api/users/avatars/${hash}.png`
};