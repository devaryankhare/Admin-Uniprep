'use client';
import CreateTestPage from "./create-test/page";
import TestsPage from "./tests/page";
import ProfilePage from "../profile/page";
import { useState } from "react";
import Navbar from "../components/ui/Navbar";

type Tab = "profile" | "create" | "list";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <main className="flex flex-col items-center min-h-screen bg-neutral-100">
      <Navbar />

      <div className="w-full max-w-6xl py-2 bg-neutral-100">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-full border border-neutral-200 p-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-full text-black ${
              activeTab === "profile"
                ? "bg-linear-to-br text-white from-pink-400 to-purple-400"
                : ""
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 rounded-t ${
              activeTab === "create"
                ? "bg-white border border-b-0"
                : "text-neutral-500"
            }`}
          >
            Create Exam
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-t ${
              activeTab === "list"
                ? "bg-white border border-b-0"
                : "text-neutral-500"
            }`}
          >
            List Exams
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-neutral-100">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <ProfilePage />
            </div>
          )}

          {activeTab === "create" && (
            <div className="space-y-4">
              <CreateTestPage />
            </div>
          )}

          {activeTab === "list" && (
            <div className="space-y-4">
              <TestsPage />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
