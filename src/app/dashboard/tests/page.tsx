"use client";
import Loader from "@/app/components/ui/loader";
import { useTestStore } from "@/store/testStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsPencilSquare } from "react-icons/bs";
import { TfiViewListAlt } from "react-icons/tfi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";


export default function TestsPage() {

  const router=useRouter()

  const {tests,fetchAllTests,loading,deleteTest}=useTestStore()

  useEffect(() => {
    fetchAllTests();
  }, [fetchAllTests]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main className="py-8">
      <h1 className="text-2xl text-black mb-6">All Mocks</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <div
        
            key={test.id}
            className="bg-white border rounded-xl shadow-md p-6"
          >
            <div className="flex justify-between items-center border-b border-neutral-600 py-2">
              <h2 className="text-xl text-black">
              {test.title}
            </h2>
            <div className="flex gap-2 justify-center items-center">
              <button onClick={()=>{router.push(`/dashboard/tests/${test.id}/edit`)}} className="flex items-center justify-center gap-2 bg-neutral-100 border border-neutral-200 shadow-sm text-sm rounded-lg text-black p-2">
                <BsPencilSquare /> Edit
              </button>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this test and all its questions?')) {
                    try {
                      await deleteTest(test.id);
                    } catch (error) {
                      alert('Cannot delete the test because it is referenced by other records. Please remove related data first.');
                    }
                  }
                }}
                className="flex items-center justify-center gap-2 bg-neutral-100 border border-neutral-200 shadow-sm text-sm rounded-lg text-black p-2"
              >
                <RiDeleteBin2Fill className="text-lg text-red-500"/>Delete
              </button>
            </div>
            </div>

            <div className="space-y-1 py-4">
              <span className="text-black text-lg py-2">Current Details:</span>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg flex justify-center items-center py-2">
                <span className="text-black text-sm">Year: {test.year}</span>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg flex justify-center items-center py-2">
                <span className="text-black text-sm">Duration: {test.duration_minutes} minutes</span>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg flex justify-center items-center py-2">
                <span className="text-black text-sm">Total Marks: {test.total_marks}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-neutral-600 pt-4">
              <h1 className="text-lg text-black">Actions:</h1>
              <button 
                onClick={() => router.push(`/dashboard/tests/${test.id}/questions`)}
                className="px-4 py-2 bg-black flex items-center justify-center gap-2 text-white rounded-lg hover:opacity-80 duration-300"
              >
                <TfiViewListAlt />View Questions
              </button>
              <button 
                onClick={() => router.push(`/dashboard/tests/${test.id}/addquestions`)}
              className="px-4 py-2 bg-emerald-300 text-black flex justify-center items-center gap-2 border rounded-lg hover:bg-emerald-500 duration-300">
                <FaPlus />Add questions
              </button>
            </div>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-gray-500 mt-10 text-center">
          No exams created yet.
        </div>
      )}
    </main>
  );
}