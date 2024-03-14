import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App.jsx";
import { Toaster } from "sonner";
import ChatProvider from "./Context/ChatProvider.jsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChatProvider>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="bottom-right" closeButton duration={2000} richColors />
    </QueryClientProvider>
  </ChatProvider>
);
