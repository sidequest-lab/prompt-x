export type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  favoriteTags?: string[];
};

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem("promptx.user");
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("promptx.user", JSON.stringify(user));
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("promptx.user");
  window.localStorage.removeItem("promptx.accessToken");
  window.localStorage.removeItem("promptx.refreshToken");
  window.sessionStorage.removeItem("promptx.accessToken");
  window.sessionStorage.removeItem("promptx.refreshToken");
}
