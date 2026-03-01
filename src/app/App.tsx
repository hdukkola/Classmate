import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect } from "react";

export default function App() {
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark-purple";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return <RouterProvider router={router} />;
}