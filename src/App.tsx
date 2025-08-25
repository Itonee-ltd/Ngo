import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./components/router";
import QueryProvider from "../src/components/services/queryProvider";

function App() {
  return (
    <>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
      <Toaster />
    </>
  );
}

export default App;
