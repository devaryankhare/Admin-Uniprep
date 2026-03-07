import { create } from "zustand";

type Test = {
  id: string;
  year: number;
  title: string;
  duration_minutes: number;
  total_marks: number;
  marks:number
  neg_marks:number
};

type TestState = {
  year: string;
  title: string;
  duration_minutes: string;
  total_marks: string;
  loading: boolean;
  marks:string
  neg_marks:string

  tests: Test[];

  setField: (field: string, value: string) => void;
  resetForm: () => void;
  createTest: () => Promise<void>;
  fetchAllTests: () => Promise<void>;
  updateTest:(id:string)=>Promise<boolean>
   fetchTestById: (id: string) => Promise<void>;
   deleteTest:(id:string)=>Promise<void>
};

export const useTestStore = create<TestState>((set, get) => ({
  year: "",
  title: "",
  duration_minutes: "",
  total_marks: "",
  marks:"",
  neg_marks:"",
  loading: false,

  tests: [],

  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  resetForm: () =>
    set({
      year: "",
      title: "",
      duration_minutes: "",
      total_marks: "",
      marks:"",
      neg_marks:""
    }),

  createTest: async () => {
    const { year, title, duration_minutes,marks,neg_marks } = get();

    set({ loading: true });

    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: Number(year),
          title,
          duration_minutes: Number(duration_minutes),
        
          marks: Number(marks),
          neg_marks: Number(neg_marks)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
      } else {
        alert("Exam created successfully");
        get().resetForm();

        // refresh list
        get().fetchAllTests();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    set({ loading: false });
  },

  fetchAllTests: async () => {
    set({loading:true})
    try {
      const res = await fetch("/api/tests");
      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      set({ tests: data.exams });
    } catch (error) {
      console.error("Failed to fetch tests", error);
    }finally{
      set({loading:false})
    }
  },
  
  updateTest: async (id) => {
    const { year, title, duration_minutes,marks,neg_marks } = get();

    set({ loading: true });

    try {
      const res = await fetch(`/api/tests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: Number(year),
          title,
          duration_minutes: Number(duration_minutes),
          marks: Number(marks),
          neg_marks: Number(neg_marks)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return false;
      }

      alert("Exam updated successfully");

      get().resetForm();
      // get().fetchAllTests();

      return true;
    } catch (error) {
      console.error("Update failed", error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchTestById: async (id) => {
    set({ loading: true });
console.log("ZUS",id);

    try {
      const res = await fetch(`/api/tests/${id}`);
      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      const exam = data.exam;

      set({
        year: exam.year.toString(),
        title: exam.title,
        duration_minutes: exam.duration_minutes.toString(),
        marks: exam.marks.toString(),
        neg_marks:exam.negative_marks.toString()
      });
    } catch (error) {
      console.error("Failed to fetch test", error);
    } finally {
      set({ loading: false });
    }
  },


deleteTest: async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this test?");

  if (!confirmDelete) return;

  const res = await fetch(`/api/tests/${id}`, {
    method: "DELETE"
  })

  if (!res.ok) {
    const data = await res.json()
    alert(data.error)
    return
  }

  alert("Test deleted")
  get().fetchAllTests()
}
}));