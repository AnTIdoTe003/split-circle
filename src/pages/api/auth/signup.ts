import type { NextApiRequest, NextApiResponse } from "next";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password, username } = SignupSchema.parse(req.body);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "Users", user.uid), {
      id: user.uid,
      email,
      username,
      roomIds: [],
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        userId: user.uid,
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
    }
    return res
      .status(500)
      .json({ success: false, message: (error as Error).message });
  }
}
