import { useDispatch, useSelector } from "react-redux";
import { login, register, getMe } from "../services/auth.api";
import { setError, setLoading, setUser } from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await register({ username, email, password });
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "registration failed"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe(params) {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "fetch user failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleGetMe,
    handleLogin,
    handleRegister,
  };
}
