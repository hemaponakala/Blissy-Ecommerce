import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getRequest, postRequest } from "../utils/apiClient.js";
import { cookie } from "../utils/cookieHelper.js";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);


  const isAuthenticated = !!token;
  const authBaseUrl = process.env.REACT_APP_AUTH_BASE_URL;

  const login = async (email, password) => {
    const userToken = await postRequest(`${authBaseUrl}/auth/login`, {
      email,
      password,
    });

    if (userToken.access_token) {
      const userDetails = await getRequest(`${authBaseUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${userToken.access_token}` },
      });

      setToken(userToken.access_token);
      setUser(userDetails);
      cookie.set("auth-token", JSON.stringify(userToken));
    }
  };

  const signup = async ({ name, email, password, avatar }) => {
    const newUser = await postRequest(`${authBaseUrl}/users`, {
      name,
      email,
      password,
      avatar,
    });

    await login(email, password);
    return newUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    cookie.remove("auth-token");
   
  };


  const getAuthToken = () => {
    const token = cookie.get("auth-token");
    return token ? JSON.parse(token) : null;
  };

  const fetchUserProfile = async (accessToken) => {
    return getRequest(`${authBaseUrl}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const refreshAccessToken = async (refreshToken) => {
    return postRequest(`${authBaseUrl}/auth/refresh-token`, {
      refreshToken,
    });
  };

  const handleAuthFlow = async () => {
    const userTokenDetails = getAuthToken();
    if (!userTokenDetails?.access_token) return;

    try {
      const userDetails = await fetchUserProfile(userTokenDetails.access_token);
      console.log("fetching", userDetails)
      setToken(userTokenDetails.access_token);
      setUser(userDetails);
    } catch {
      if (!userTokenDetails?.refresh_token) {
        return logout();
      }

      try {
        const newToken = await refreshAccessToken(
          userTokenDetails.refresh_token
        );
        if (!newToken?.access_token) return logout();

        const refreshedUser = await fetchUserProfile(newToken.access_token);
        cookie.set("auth-token", JSON.stringify(newToken));
        setToken(newToken.access_token);
        setUser(refreshedUser);
      } catch {
        logout();
      }
    }
  };
  useEffect(() => {
    handleAuthFlow();
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      signup,
      logout,
    }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
