import { z } from "zod";

export const emailSchema = (emptyMessage?: string) =>
	z
		.string()
		.min(1, { message: emptyMessage })
		.email({ message: "Email address is required." });

export const passwordSchema = (emptyMessage?: string) =>
	z
		.string()
		.min(1, {
			message: emptyMessage ?? "Password is required.",
		})
		.min(8, { message: "Password must be at least 8 characters long." })
		.refine((val) => /[A-Z]/.test(val), {
			message: "Password must contain at least one uppercase letter.",
		})
		.refine((val) => /[a-z]/.test(val), {
			message: "Password must contain at least one lowercase letter.",
		})
		.refine((val) => /\d/.test(val), {
			message: "Password must contain at least one number.",
		})
		.refine((val) => /[@$!%*?&#]/.test(val), {
			message: "Password must contain at least one special character.",
		});
