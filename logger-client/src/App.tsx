import "./App.css";
import { Suspense, lazy } from "react";
import reactLogo from "./assets/react.svg";

// Works also with SSR as expected
const LogViewer = lazy(() => import("./log-viewer"));
const Card = lazy(() => import("./Card"));
function App() {
  return (
    <>
      <Suspense fallback={<p>Loading log viewer...</p>}>
        <LogViewer />
      </Suspense>
      <Suspense fallback={<p>Loading card...</p>}>
        <Card />
      </Suspense>
    </>
  );
}

export default App;
