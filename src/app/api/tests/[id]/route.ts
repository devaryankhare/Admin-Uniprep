import { requireAdmin } from "@/app/lib/auth/requireAdmin";
import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ unwrap params

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;

    const body = await req.json();
    const { title, year, duration_minutes } = body;

    const { data, error } = await supabase
      .from("tests")
      .update({
        title,
        year,
        duration_minutes,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { exam: data },
      { status: 200 }  // ✅ success status
    );

  } catch (error) {
    console.error("Server error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ FIX

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;

    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ exam: data });

  } catch (err) {
    console.error("Server error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { supabase } = auth

    const { error } = await supabase
      .from("tests")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: "Test deleted successfully"
    },{status:200})

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}