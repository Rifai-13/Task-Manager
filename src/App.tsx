import TaskManager from "./TaskManager";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <TaskManager />
    </AuthProvider>
  );
}

export default App;
