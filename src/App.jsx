import { Layout } from "./components/Layout";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import Home from "./components/Home";
import PDFUploader from "./components/Upload";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<PDFUploader />} />
          </Routes>
        </Layout>
      </Router>
    </MantineProvider>
  );
}

export default App;
