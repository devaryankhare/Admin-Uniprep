import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth/requireAdmin";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;

    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Question deleted successfully",
      id
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}