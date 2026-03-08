"use client";

import { useRef } from "react";
import * as XLSX from "xlsx";
import { useQuestionStore } from "@/store/questionStore";

export default function QuestionUpload({ testId }: { testId: string }) {
  const fileInput = useRef<HTMLInputElement>(null);

  const { rows, setRows, createQuestions, loading } = useQuestionStore();

  const parseFile = async (file: File) => {
    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(sheet);

    setRows(json as any);
  };

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];
    if (file) parseFile(file);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 text-black">

      {/* Upload Button */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => fileInput.current?.click()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Select Excel File
        </button>

        <input
          ref={fileInput}
          type="file"
          hidden
          accept=".xlsx"
          onChange={handleFileSelect}
        />

        {rows.length > 0 && (
          <button
            onClick={() => createQuestions(testId)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Uploading..." : "Upload Questions"}
          </button>
        )}
      </div>

      {/* Preview Table */}
      {rows.length > 0 && (
        <div className="overflow-x-auto border border-gray-400 rounded">
          <table className="w-full text-sm border-collapse text-black">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="border border-gray-400 p-2">Order</th>
                <th className="border border-gray-400 p-2">Question</th>
                <th className="border border-gray-400 p-2">A</th>
                <th className="border border-gray-400 p-2">B</th>
                <th className="border border-gray-400 p-2">C</th>
                <th className="border border-gray-400 p-2">D</th>
                <th className="border border-gray-400 p-2">Correct</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row: any, i) => (
                <tr key={i} className="border-t border-gray-400">
                  <td className="border border-gray-400 p-2">{row.question_order}</td>
                  <td className="border border-gray-400 p-2">{row.question_text}</td>
                  <td className="border border-gray-400 p-2">{row.option_a}</td>
                  <td className="border border-gray-400 p-2">{row.option_b}</td>
                  <td className="border border-gray-400 p-2">{row.option_c}</td>
                  <td className="border border-gray-400 p-2">{row.option_d}</td>
                  <td className="border border-gray-400 p-2 font-bold text-blue-700">
                    {row.correct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}