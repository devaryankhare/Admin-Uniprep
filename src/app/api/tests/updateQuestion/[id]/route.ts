import { NextResponse } from "next/server";

import { requireAdmin } from "@/app/lib/auth/requireAdmin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { supabase } = auth;

    const body = await req.json();

    const { question_text, options } = body;

    // 1️⃣ Update question table (only if question_text changed)
    if (question_text) {
      const { error } = await supabase
        .from("questions")
        .update({ question_text })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    // 2️⃣ Update options table (only changed options)
    if (options && options.length > 0) {
      for (const option of options) {
        const { error } = await supabase
          .from("options")
          .update({
            option_text: option.option_text,
            is_correct: option.is_correct,
          })
          .eq("id", option.id);

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }
      }
    }

      const { data: question } = await supabase
      .from("questions")
      .select(`
        id,
        question_text,
        question_order,
        options(
          id,
          option_text,
          is_correct
        )
      `)
      .eq("id", id)
      .single();

    return NextResponse.json({
      question,
    });


  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}