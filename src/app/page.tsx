

export default function Home() {
return (
    <div className="min-h-screen bg-blue-50 p-10">
      
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Users
          </h2>
          <p className="text-3xl mt-3 font-bold text-blue-600">
            128
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Exams
          </h2>
          <p className="text-3xl mt-3 font-bold text-green-600">
            24
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-600">
            Active Exams
          </h2>
          <p className="text-3xl mt-3 font-bold text-purple-600">
            5
          </p>
        </div>

      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Quick Actions
        </h2>

        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Create Exam
          </button>

          <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">
            Manage Users
          </button>
        </div>
      </div>

    </div>
  );
}
