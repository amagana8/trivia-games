import { createVerifier } from 'fast-jwt';

export const verifyJwt = createVerifier({ key: process.env.JWT_PUBLIC_KEY });
