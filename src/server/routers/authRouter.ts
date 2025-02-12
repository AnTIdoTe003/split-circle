import { trpc } from '../trpc';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const authRouter = trpc.router({
    login: trpc.procedure.input(loginSchema).mutation(async ({ input }) => {
        const { email, password } = input;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return {
            message: 'Login successful',
            userId: user.uid,
            email: user.email,
        };
    }),
});
