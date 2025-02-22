import { TRPCError } from "@trpc/server";
import {
  signInWithEmailAndPassword,
  AuthError,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { z } from "zod";
import { publicProcedure, router } from "@/server/trpc";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth } from "../../../firebaseConfig";
import { FirebaseError } from "@firebase/app";

const db = getFirestore();
export const usersRouter = router({
  getUser: publicProcedure.query(() => {
    return { id: "1", name: "John Doe" };
  }),
  loginUser: publicProcedure
    .input(
      z.object({
        identifier: z.string().min(3, "Enter a valid username or email"),
        password: z
          .string()
          .min(6, "Password must be at least 6 characters long"),
      })
    )
    .mutation(async ({ input }) => {
      const { identifier, password } = input;
      let email = identifier;

      if (identifier.includes("@")) {
        email = identifier;
      } else {
        const foundEmail = await getEmailFromUsername(identifier);
        if (!foundEmail) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }
        email = foundEmail;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        return {
          message: "Login successful",
          userId: user.uid,
          email: user.email,
        };
      } catch (error) {
        const firebaseError = error as AuthError;

        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: mapFirebaseAuthError(firebaseError.code),
        });
      }
    }),
  signupUser: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
        username: z
          .string()
          .min(3, "Username must be at least 3 characters long"),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password, username } = input;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email,
          username,
          roomIds: [],
        });

        return {
          message: "Signup successful",
          userId: user.uid,
          email,
          username,
        };
      } catch (error) {
        let errorMessage = "Signup failed";

        if (error instanceof FirebaseError) {
          if (error.code === "auth/email-already-in-use") {
            errorMessage = "Email already registered";
          } else {
            errorMessage = error.message;
          }
          return { message: errorMessage, code: error.code };
        }

        return { message: errorMessage, code: "unknown_error" };
      }
    }),
});
async function getEmailFromUsername(username: string): Promise<string | null> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return userDoc.data().email as string;
  }
  return null;
}

function mapFirebaseAuthError(code: string): string {
  const errorMessages: Record<string, string> = {
    "auth/invalid-email": "Invalid email format.",
    "auth/user-disabled": "User account is disabled.",
    "auth/user-not-found": "User not found.",
    "auth/wrong-password": "Incorrect password.",
    "auth/too-many-requests": "Too many failed attempts. Try again later.",
  };

  return (
    errorMessages[code] || "Invalid credentials. Please check your details."
  );
}
