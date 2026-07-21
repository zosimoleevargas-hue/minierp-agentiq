import { NextResponse } from "next/server";

export function apiError(error: unknown): NextResponse {
  if (error && typeof error === "object" && "code" in error) {
    const pgError = error as { code: string; message: string };
    if (pgError.code === "23505") {
      return NextResponse.json(
        { error: "Ya existe un registro con ese correo electrónico" },
        { status: 409 },
      );
    }
  }
  return NextResponse.json(
    { error: "Error interno del servidor" },
    { status: 500 },
  );
}
