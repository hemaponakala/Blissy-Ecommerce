import Cookies from 'js-cookie';
 
export const cookie = {
  set: (name, value, days = 1) =>
    Cookies.set(name, value, {
      expires: days,
      path: '/',
      sameSite: 'Lax', // or 'None' + secure: true for cross-site
      secure: true,
    }),
  get: (name) => Cookies.get(name) ?? null,
  remove: (name) => Cookies.remove(name, { path: '/' }),
};
 