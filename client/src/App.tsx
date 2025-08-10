import { ThemeProvider } from "@/components/theme-provider"


import { useState, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "./components/mode-toggle";
import { IoArrowBack } from "react-icons/io5";

interface ApiResponse {
  data?: string | object;
  error?: string;
  contentType?: string;
  originalUrl?: string;
  status?: number;
  statusText?: string;
  time?: number;
  size?: number;
}

interface Header {
  id: string;
  key: string;
  value: string;
  description: string;
  enabled: boolean;
}

interface SavedUrl {
  name: string;
  url: string;
  method: string;
  headers: string;
  body: string;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<Header[]>([
    { id: "1", key: "", value: "", description: "", enabled: true },
  ]);
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [savedUrls, setSavedUrls] = useState<SavedUrl[]>([]);
  const [urlName, setUrlName] = useState("");
  const [htmlViewMode, setHtmlViewMode] = useState<"preview" | "raw">("preview");
  const [copiedMessage, setCopiedMessage] = useState("");
  const [scrapeMode, setScrapeMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    const storedUrls = localStorage.getItem("apiClientSavedUrls");
    if (storedUrls) {
      setSavedUrls(JSON.parse(storedUrls));
    }
  }, []);

  const handleCopy = (text: string | object) => {
    let textToCopy: string;
    if (typeof text === "object") {
      textToCopy = JSON.stringify(text, null, 2);
    } else {
      textToCopy = text;
    }
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopiedMessage("Copied!");
        setTimeout(() => setCopiedMessage(""), 2000);
      })
      .catch(() => {
        setCopiedMessage("Failed to copy!");
        setTimeout(() => setCopiedMessage(""), 2000);
      });
  };

  const handleAddHeader = () => {
    setHeaders([
      ...headers,
      { id: String(Date.now()), key: "", value: "", description: "", enabled: true },
    ]);
  };

  const handleRemoveHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id));
  };

  const handleHeaderChange = (id: string, field: keyof Header, value: string | boolean) => {
    setHeaders(
      headers.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      )
    );
  };

  const handleSendRequest = async () => {
    if (!url) {
      setResponse({ error: "Please enter a URL." });
      return;
    }
    setResponse(null);
    setLoading(true);
    const startTime = Date.now();
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const parsedHeaders: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.enabled && h.key) {
          parsedHeaders[h.key.trim()] = h.value.trim();
        }
      });

      let dataToSend: string | object = requestBody;
      if (
        parsedHeaders["Content-Type"] &&
        parsedHeaders["Content-Type"].includes("application/json")
      ) {
        try {
          dataToSend = JSON.parse(requestBody);
        } catch {
          setResponse({ error: "Invalid JSON in request body." });
          setLoading(false);
          return;
        }
      }

      const requestBodyToSend: {
        url: string;
        scrapeMode: boolean;
        method?: string;
        headers?: Record<string, string>;
        data?: string | object;
      } = { url, scrapeMode };

      if (!scrapeMode) {
        requestBodyToSend.method = method;
        requestBodyToSend.headers = parsedHeaders;
        requestBodyToSend.data = dataToSend;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/proxy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBodyToSend),
          signal: controller.signal,
        }
      );

      const contentType = res.headers.get("content-type");
      const contentLength = res.headers.get("content-length");
      const responseSize = contentLength ? parseInt(contentLength, 10) : 0;
      const requestTime = Date.now() - startTime;

      let resultData: string | object;
      if (contentType && contentType.includes("application/json")) {
        resultData = await res.json();
      } else {
        resultData = await res.text();
      }

      setResponse({
        data: resultData,
        contentType: contentType || "text/plain",
        originalUrl: url,
        status: res.status,
        statusText: res.statusText,
        time: requestTime,
        size: responseSize,
      });
      setHtmlViewMode("preview");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setResponse({ error: "Request cancelled." });
      } else if (error instanceof Error) {
        setResponse({ error: `Request failed: ${error.message}` });
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleSaveUrl = () => {
    if (urlName && url) {
      const newEntry: SavedUrl = {
        name: urlName,
        url,
        method: scrapeMode ? "SCRAPE" : method,
        headers: JSON.stringify(headers),
        body: requestBody,
      };
      const newSavedUrls = [...savedUrls, newEntry];
      setSavedUrls(newSavedUrls);
      localStorage.setItem("apiClientSavedUrls", JSON.stringify(newSavedUrls));
      setUrlName("");
    } else {
      alert("Please enter a name and URL to save.");
    }
  };

  const handleDeleteUrl = (index: number) => {
    const updatedUrls = savedUrls.filter((_, i) => i !== index);
    setSavedUrls(updatedUrls);
    localStorage.setItem("apiClientSavedUrls", JSON.stringify(updatedUrls));
  };

  const handleLoadUrl = (selectedUrl: SavedUrl) => {
    setUrl(selectedUrl.url);
    setMethod(selectedUrl.method === "SCRAPE" ? "GET" : selectedUrl.method);
    setScrapeMode(selectedUrl.method === "SCRAPE");
    setHeaders(JSON.parse(selectedUrl.headers));
    setRequestBody(selectedUrl.body);
  };

  const handleCancelRequest = () => {
    if (abortController) {
      abortController.abort();
      setLoading(false);
      setResponse({ error: "Request cancelled by user." });
    }
  };

  return (
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

    <div className="flex flex-col md:flex-row min-h-screen">
    

      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r p-4 order-3 md:order-1">
        
        <h3 className="font-bold mb-2">Saved Requests</h3>
        <ScrollArea className="h-[calc(100vh-100px)]">
          <ul className="space-y-1">
            {savedUrls.map((su, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-50 p-2 rounded hover:bg-gray-100"
              >
                <span
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handleLoadUrl(su)}
                >
                  {su.name}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUrl(index)}
                >
                  ✕
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </aside>

      <main className="flex-1 p-4 space-y-4 order-2 md:order-2">
        {/* Request Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Request</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Input
                placeholder="Name to Save"
                value={urlName}
                onChange={(e) => setUrlName(e.target.value)}
              />

              <Button onClick={handleSendRequest} disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </Button>
              {loading && (
                <Button variant="destructive" onClick={handleCancelRequest}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSaveUrl}>Save</Button>
              <Button
                variant={scrapeMode ? "secondary" : "outline"}
                onClick={() => {
                  setScrapeMode(!scrapeMode);
                  setResponse(null);
                }}
              >
                {scrapeMode ? "🌐 Scrape Mode" : "🌐 Normal Mode"}
              </Button>
            </div>

            {/* Headers Editor */}
            <div>
              <h4 className="font-semibold mb-2">Headers</h4>
              {headers.map((header) => (
                <div key={header.id} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Key"
                    value={header.key}
                    onChange={(e) =>
                      handleHeaderChange(header.id, "key", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) =>
                      handleHeaderChange(header.id, "value", e.target.value)
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveHeader(header.id)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button size="sm" onClick={handleAddHeader}>
                + Add Header
              </Button>
            </div>

            {/* Body */}
            <div>
              <h4 className="font-semibold mb-2">Body</h4>
              <Textarea
                placeholder="Request body (JSON, text, etc.)"
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

  {/* Response */}
<Card>
  <CardHeader>
    <CardTitle>Response</CardTitle>
  </CardHeader>
  <CardContent className="whitespace-pre-wrap break-words">
    {loading && <p>Loading...</p>}
    {response && (
      <>
        {response.status && (
          <div className="mb-2">
            <span>
              {response.status} {response.statusText}
            </span>
            {response.time !== undefined && (
              <span> | {response.time} ms</span>
            )}
            {response.size !== undefined && (
              <span> | {response.size} B</span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => handleCopy(response.data || response.error || "")}
            >
              Copy
            </Button>
            {copiedMessage && <span className="ml-2">{copiedMessage}</span>}
          </div>
        )}

        {response.contentType?.includes("text/html") ? (
          htmlViewMode === "preview" ? (
            <iframe
              srcDoc={
                scrapeMode && typeof response.data === "string"
                  ? response.data
                  : undefined
              }
              src={
                !scrapeMode && response.originalUrl
                  ? response.originalUrl
                  : undefined
              }
              className="w-full h-96 border"
            />
          ) : (
            <SyntaxHighlighter
              language="html"
              style={docco}
              wrapLongLines
            >
              {String(response.data)}
            </SyntaxHighlighter>
          )
        ) : (
          <SyntaxHighlighter
            language="json"
            style={docco}
            wrapLongLines
          >
            {JSON.stringify(response.data || response.error, null, 2)}
          </SyntaxHighlighter>
        )}
      </>
    )}
  </CardContent>
</Card>


        {/* Social */}
        <div className="flex space-x-4 mt-4">
          <a
            href="https://github.com/bikash1376"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/bikash1376"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://x.com/bikash1376"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
            <Link to='/home' className=""><IoArrowBack /></Link>
          
        </div>
      </main>

      {/* Main */}
 
        <div className="order-1 justify-between md:order-3 flex p-4">
          <Link to='/home' className="md:hidden">Pistash</Link>
  <ModeToggle />

</div>


    </div>
        </ThemeProvider>
  );
}
