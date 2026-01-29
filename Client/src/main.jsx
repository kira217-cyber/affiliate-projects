import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router.jsx";
import LanguageProvider from "./Context/LanguageContext";
import { Provider } from "react-redux";
import store from "./store/store";
import { AuthProvider } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    {/* আপনার রাউটার */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '14px',
          },
          success: { icon: 'Success' },
          error: { icon: 'Error' },
        }}
      />
    <Provider store={store}>
      <LanguageProvider>
        <RouterProvider router={Router} />
      </LanguageProvider>
    </Provider>
  </AuthProvider>
);
