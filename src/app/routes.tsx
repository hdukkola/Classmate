import { createBrowserRouter } from "react-router";
import { Home } from "./screens/Home";
import { GradesNew } from "./screens/GradesNew";
import { ClassDetail } from "./screens/ClassDetail";
import { GPA } from "./screens/GPA";
import { Analytics } from "./screens/Analytics";
import { Settings } from "./screens/Settings";
import { AI } from "./screens/AI";
import { Root } from "./Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "grades", Component: GradesNew },
      { path: "gpa", Component: GPA },
      { path: "analytics", Component: Analytics },
      { path: "ai", Component: AI },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/class/:classId",
    Component: ClassDetail,
  },
]);