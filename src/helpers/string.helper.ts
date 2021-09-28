export const removeBearer = (token: string) => {
  return token.split(' ')[1];
};
