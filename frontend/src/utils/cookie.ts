interface CookieOptions {
  seconds?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

const get = (key: string): string | null => {
  const name = key + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length);
    }
  }

  return null;
};

const add = (key: string, data: string, options: CookieOptions = {}): void => {
  const {
    seconds,
    path = "/",
    secure = false,
    sameSite = "Lax"
  } = options;

  let cookieString = `${key}=${encodeURIComponent(data)}`;

  if (seconds) {
    const date = new Date();
    date.setTime(date.getTime() + seconds * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  cookieString += `; path=${path}`;
  cookieString += `; SameSite=${sameSite}`;

  if (secure) {
    cookieString += `; Secure`;
  }

  document.cookie = cookieString;
};

const update = (key: string, data: string, options: CookieOptions = {}): void => {
  remove(key);
  add(key, data, options);
};

const remove = (key: string): void => {
  add(key, "", { seconds: -1 });
};

export default {
  get,
  add,
  update,
  remove,
};
