import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./contexts/authContext.jsx";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <App />
    </AuthProvider>
  </QueryClientProvider>
);

axios.defaults.baseURL = "http://127.0.0.1:8000/";
axios.defaults.withCredentials = true;
