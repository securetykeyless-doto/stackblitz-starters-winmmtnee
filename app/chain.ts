import { defineChain } from "thirdweb";

// Використовуємо чіткий ID мережі Base (8453)
// Це найнадійніший спосіб, щоб SDK точно знало, де шукати твої токени
export const chain = defineChain(8453);