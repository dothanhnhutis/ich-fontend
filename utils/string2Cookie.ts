export default function string2Cookie(cookieHeader: string) {
  const cookieRegex = /[^,]+(?:,(?!\s*[A-Za-z0-9!#$%&'*+\-.^_`|~]+=)[^,]+)*/g;
  const cookiesArray = cookieHeader.match(cookieRegex);

  const cookies: {
    name: string;
    value: string;
    options: CookieOpt;
  }[] = [];

  if (cookiesArray) {
    cookiesArray.forEach((cookieStr) => {
      const parts = cookieStr.split(";").map((part) => part.trim());
      const [nameValue, ...attributes] = parts;
      const [name, value] = nameValue.split("=");

      const options: CookieOpt = { path: "/" };

      attributes.forEach((attr) => {
        const [attrName, attrVal] = attr.split("=");
        switch (attrName.toLowerCase()) {
          case "expires":
            options.expires = new Date(attrVal);
            break;
          case "path":
            options.path = attrVal;
            break;
          case "httponly":
            options.httpOnly = true;
            break;
          case "secure":
            options.secure = true;
            break;
          case "samesite":
            options.sameSite = attrVal as CookieOpt["sameSite"];
            break;
          default:
            break;
        }
      });
      cookies.push({
        name,
        value,
        options,
      });
    });
  }

  return cookies;
}
