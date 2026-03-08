"use client";

import { useEffect, useState } from "react";
import { useQuestionStore } from "@/store/questionStore";

export default function QuestionsTable({ testId }: { testId: string }) {
  const { questions, getQuestionsByTest, loading,updateQuestion,questionUpdation ,deleteQuestion,questionDeletion} = useQuestionStore();

const [editingId, setEditingId] = useState<string | null>(null);
const [editData, setEditData] = useState<any>(null);
const [originalData, setOriginalData] = useState<any>(null);
const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getQuestionsByTest(testId);
  }, [testId]);

const startEdit = (q: any) => {
  setEditingId(q.id);
  setEditData(JSON.parse(JSON.stringify(q)));
  setOriginalData(JSON.parse(JSON.stringify(q)));
};

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...editData.options];
    updated[index].option_text = value;
    setEditData({ ...editData, options: updated });
  };

  const toggleCorrect = (index: number) => {
    const updated = editData.options.map((o: any, i: number) => ({
      ...o,
      is_correct: i === index,
    }));

    setEditData({ ...editData, options: updated });
  };




const handleSave = async () => {

  const payload: any = {
    question_id: editData.id
  };

  // check question text change
  if (editData.question_text !== originalData.question_text) {
    payload.question_text = editData.question_text;
  }

  // check options change
  const changedOptions = editData.options.filter(
    (o: any, i: number) =>
      o.option_text !== originalData.options[i].option_text ||
      o.is_correct !== originalData.options[i].is_correct
  );

  if (changedOptions.length > 0) {
    payload.options = changedOptions.map((o: any) => ({
      id: o.id,
      option_text: o.option_text,
      is_correct: o.is_correct,
    }));
  }

  // if nothing changed
  if (!payload.question_text && !payload.options) {
    alert("Nothing changed");
    setEditingId(null);
    return;
  }

  await updateQuestion(editData.id, payload);

  setEditingId(null);
};

const handleDelete = async (id: string) => {
  setDeletingId(id);

  await deleteQuestion(id);

  setDeletingId(null);
};



  if (loading) {
    return (
      <div className="p-10 text-center text-black">
        Loading Questions...
      </div>
    );
  }



  
  return (
    <div className="max-w-6xl mx-auto mt-10">
 <h1 className="text-black">No of Questions {questions.length}</h1>
      <table className="w-full border border-gray-400 text-black">
{questions &&
(        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Order</th>
            <th className="border p-2">Question</th>
            <th className="border p-2">Options</th>
            <th className="border p-2">Correct</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>)
}
        <tbody>
          {questions.map((q) => {

            const isEditing = editingId === q.id;
            const row = isEditing ? editData : q;

            return (
              <tr key={q.id} className="border">

                {/* Order */}
                <td className="border p-2">{row.question_order}</td>

                {/* Question */}
                <td className="border p-2">
                  {isEditing ? (
                    <input
                      className="border p-1 w-full text-black"
                      value={row.question_text}
                      onChange={(e) =>
                        setEditData({
                          ...row,
                          question_text: e.target.value,
                        })
                      }
                    />
                  ) : (
                    row.question_text
                  )}
                </td>

                {/* Options */}
                <td className="border p-2 space-y-2">
                  {row.options.map((o: any, i: number) => (
                    <div key={o.id} className="flex gap-2 items-center">

                      {isEditing ? (
                        <input
                          className="border p-1 flex-1 text-black"
                          value={o.option_text}
                          onChange={(e) =>
                            handleOptionChange(i, e.target.value)
                          }
                        />
                      ) : (
                        <span>{o.option_text}</span>
                      )}

                    </div>
                  ))}
                </td>

                {/* Correct Toggle */}
              <td className="border p-2 space-y-2">
  {row.options.map((o: any, i: number) => (
    <div key={o.id} className="flex items-center gap-3">

      <span>{o.option_text}</span>

      {isEditing ? (
        <button
          onClick={() => toggleCorrect(i)}
          className={`w-10 h-5 rounded-full flex items-center transition ${
            o.is_correct ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transform transition ${
              o.is_correct ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      ) : (
        o.is_correct && (
          <span className="text-green-700 font-semibold">Correct</span>
        )
      )}

    </div>
  ))}
</td>

                {/* Actions */}
                <td className="border p-2 flex gap-2">

                  {isEditing ? (
                    <>
                      <button
  onClick={handleSave}
  className="bg-green-600 text-white px-3 py-1 rounded"
>
  Save
</button>

                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(q)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
    <button
  onClick={() => handleDelete(q.id)}
  className="bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1"
>
  {deletingId === q.id ? (
    <>
      Deleting
      <span className="animate-pulse">.</span>
      <span className="animate-pulse delay-150">.</span>
      <span className="animate-pulse delay-300">.</span>
    </>
  ) : (
    "Delete"
  )}
</button>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>


      {questionUpdation && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30">
  <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
    <div className="flex items-center text-black text-lg font-medium gap-2">
      Saving
      <span className="flex gap-1">
        <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-300"></span>
      </span>
    </div>
  </div>
</div>
      )}
    </div>

    
  );
}

