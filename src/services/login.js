// Giữ tương thích import cũ bằng cách export lại từ auth service.
export { login as default, login, register, fetchUserProfile } from "./auth";
