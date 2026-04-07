import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "~/config";

export default async function loginDefault() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "duong.703909@gmail.com",
      "123456"
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}
