const appCookie = (cookieName: string) => {
  const allCookies = document.cookie
    .split('; ')
    .reduce((acc: { [key: string]: string }, cookie) => {
      const [cookieName, cookieValue] = cookie.split('=');
      acc[cookieName] = cookieValue;
      return acc;
    }, {});
  return allCookies[cookieName];
};

export default appCookie;
