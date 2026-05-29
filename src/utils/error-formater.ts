import { NextResponse } from "next/server";

export const handleApiError = (error: unknown) => {
  let errorMessage = "Internal Server Error";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String((error as { message: unknown }).message);
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return NextResponse.json(
    { success: false, error: errorMessage },
    { status: 500 }
  );
};
