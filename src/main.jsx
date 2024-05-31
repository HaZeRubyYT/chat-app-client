import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {SocketProvider} from "./SocketProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <SocketProvider>
      <App />
    </SocketProvider>
);
