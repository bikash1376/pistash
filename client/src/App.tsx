import { useState, useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './App.css';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

interface ApiResponse {
  data?: any;
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

function App() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState<Header[]>([{ id: '1', key: '', value: '', description: '', enabled: true }]);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [savedUrls, setSavedUrls] = useState<{ name: string; url: string; method: string; headers: string; body: string }[]>([]);
  const [urlName, setUrlName] = useState('');
  const [htmlViewMode, setHtmlViewMode] = useState<'preview' | 'raw'>('preview');
  const [copiedMessage, setCopiedMessage] = useState('');
  const [requestTab, setRequestTab] = useState('headers');
  const [scrapeMode, setScrapeMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    const storedUrls = localStorage.getItem('apiClientSavedUrls');
    if (storedUrls) {
      setSavedUrls(JSON.parse(storedUrls));
    }
  }, []);

  const handleCopy = (text: any) => {
    let textToCopy: string;
    
    if (typeof text === 'object') {
      textToCopy = JSON.stringify(text, null, 2);
    } else {
      textToCopy = String(text);
    }

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopiedMessage('Copied!');
        setTimeout(() => setCopiedMessage(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setCopiedMessage('Failed to copy!');
        setTimeout(() => setCopiedMessage(''), 2000);
      });
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { id: String(Date.now()), key: '', value: '', description: '', enabled: true }]);
  };

  const handleRemoveHeader = (id: string) => {
    setHeaders(headers.filter(header => header.id !== id));
  };

  const handleHeaderChange = (id: string, field: keyof Header, value: string | boolean) => {
    setHeaders(headers.map(header =>
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const handleSendRequest = async () => {
    if (!url) {
      setResponse({ error: 'Please enter a URL.' });
      return;
    }

    if (!scrapeMode && !method) {
      setResponse({ error: 'Please select a method or enable scrape mode.' });
      return;
    }

    setResponse(null); // Clear previous response
    setLoading(true); // Set loading state
    const startTime = Date.now();

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const parsedHeaders: { [key: string]: string } = {};
      headers.forEach(h => {
        if (h.enabled && h.key) {
          parsedHeaders[h.key.trim()] = h.value.trim();
        }
      });

      let dataToSend: any = requestBody;
      if (parsedHeaders['Content-Type'] && parsedHeaders['Content-Type'].includes('application/json')) {
        try {
          dataToSend = JSON.parse(requestBody);
        } catch (e) {
          setResponse({ error: 'Invalid JSON in request body.' });
          setLoading(false);
          setAbortController(null);
          return;
        }
      }

      const requestBodyToSend: any = {
        url,
        scrapeMode,
      };

      if (!scrapeMode) {
        requestBodyToSend.method = method;
        requestBodyToSend.headers = parsedHeaders;
        requestBodyToSend.data = dataToSend;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBodyToSend),
        signal: controller.signal, // Pass the abort signal
      });

      const contentType = res.headers.get('content-type');
      const contentLength = res.headers.get('content-length');
      const responseSize = contentLength ? parseInt(contentLength, 10) : 0; // Bytes
      const endTime = Date.now();
      const requestTime = endTime - startTime; // Milliseconds

      let resultData;

      if (contentType && contentType.includes('application/json')) {
        resultData = await res.json();
      } else if (contentType && contentType.includes('text/html')) {
        resultData = await res.text();
      } else {
        resultData = await res.text(); // Default to text for other types
      }
      
      setResponse({
        data: resultData,
        contentType: contentType || 'text/plain',
        originalUrl: url,
        status: res.status,
        statusText: res.statusText,
        time: requestTime,
        size: responseSize,
      });
      setHtmlViewMode('preview'); // Reset to preview mode on new HTML response

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted by user');
        setResponse({ error: 'Request cancelled.' });
      } else {
        const endTime = Date.now();
        const requestTime = endTime - startTime; // Milliseconds
        setResponse({ error: `Request failed: ${error.message}`, time: requestTime });
      }
    } finally {
      setLoading(false); // Always stop loading, regardless of success or error
      setAbortController(null); // Clear the abort controller
    }
  };

  const handleSaveUrl = () => {
    if (urlName && url) {
      const newSavedUrls = [...savedUrls, { name: urlName, url, method: scrapeMode ? 'SCRAPE' : method, headers: JSON.stringify(headers), body: requestBody }];
      setSavedUrls(newSavedUrls);
      localStorage.setItem('apiClientSavedUrls', JSON.stringify(newSavedUrls));
      setUrlName('');
    } else {
      alert('Please enter a name and URL to save.');
    }
  };

  const handleLoadUrl = (selectedUrl: { name: string; url: string; method: string; headers: string; body: string }) => {
    setUrl(selectedUrl.url);
    setMethod(selectedUrl.method === 'SCRAPE' ? 'GET' : selectedUrl.method);
    setScrapeMode(selectedUrl.method === 'SCRAPE');
    setHeaders(JSON.parse(selectedUrl.headers));
    setRequestBody(selectedUrl.body);
  };

  const handleCancelRequest = () => {
    if (abortController) {
      abortController.abort();
      setLoading(false); // Ensure loading state is reset
      setResponse({ error: 'Request cancelled by user.' }); // Provide immediate feedback
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="saved-urls-section">
          <h3>Saved Requests</h3>
          <ul className="saved-urls-list">
            {savedUrls.map((su, index) => (
              <li 
                key={index} 
                className="saved-url-item"
                onClick={() => handleLoadUrl(su)}
              >
                {su.name}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Request Section */}
        <div className="request-section-container">
          <div className="url-bar">
            <select 
              className="method-select"
              value={method} 
              onChange={(e) => setMethod(e.target.value)}
              disabled={loading || scrapeMode}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              className="url-input"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <button 
              onClick={handleSendRequest} 
              disabled={loading} 
              className="send-button"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </button>
            {loading && (
              <button 
                onClick={handleCancelRequest} 
                className="cancel-button"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => setShowSaveDialog(true)}
              className="save-button"
              disabled={loading}
            >
              Save Request
            </button>
            <button
              className={`scrape-button ${scrapeMode ? 'active' : ''}`}
              onClick={() => {
                setScrapeMode(!scrapeMode);
                setResponse(null);
              }}
              disabled={loading}
            >
              {scrapeMode ? '🌐 Scrape Mode' : '🌐 Normal Mode'}
            </button>
          </div>

          {showSaveDialog && (
            <div className="save-dialog">
              <div className="save-dialog-content">
                <h3>Save Request</h3>
                <input
                  type="text"
                  placeholder="Name for URL (e.g., 'Login API')"
                  value={urlName}
                  onChange={(e) => setUrlName(e.target.value)}
                  disabled={loading}
                />
                <div className="save-dialog-buttons">
                  <button onClick={handleSaveUrl}>Save</button>
                  <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {!scrapeMode && (
            <>
              <div className="request-tabs">
                <button 
                  className={requestTab === 'headers' ? 'active' : ''} 
                  onClick={() => setRequestTab('headers')}
                >
                  Headers
                </button>
                <button 
                  className={requestTab === 'body' ? 'active' : ''} 
                  onClick={() => setRequestTab('body')}
                >
                  Body
                </button>
              </div>

              {requestTab === 'headers' && (
                <div className="headers-section">
                  {headers.map((header) => (
                    <div key={header.id} className="header-row">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => handleHeaderChange(header.id, 'enabled', e.target.checked)}
                        disabled={loading}
                      />
                      <input
                        type="text"
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) => handleHeaderChange(header.id, 'key', e.target.value)}
                        disabled={loading}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => handleHeaderChange(header.id, 'value', e.target.value)}
                        disabled={loading}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={header.description}
                        onChange={(e) => handleHeaderChange(header.id, 'description', e.target.value)}
                        disabled={loading}
                      />
                      <button 
                        onClick={() => handleRemoveHeader(header.id)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddHeader} 
                    className="add-header-button"
                    disabled={loading}
                  >
                    Add Header
                  </button>
                </div>
              )}

              {requestTab === 'body' && (
                <div className="body-editor">
                  <textarea
                    placeholder={`Enter JSON or plain text body\n(e.g., {\"key\": \"value\"})`}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    disabled={loading}
                  ></textarea>
                </div>
              )}
            </>
          )}

          {scrapeMode && (
            <p className="scrape-info">
              Scrape mode enabled: Only URL is used. Method, Headers, and Body are ignored.
            </p>
          )}
        </div>

        {/* Response Section */}
        <div className="response-section-container">
          <div className="response-header">
            <h2>Response</h2>
            {response?.data && (
              <button 
                onClick={() => handleCopy(response.data)}
                className="copy-button"
              >
                Copy Response
                {copiedMessage && <span className="copied-message">{copiedMessage}</span>}
              </button>
            )}
          </div>

          {loading && <p className="loading-message">Loading...</p>}

          {response && response.status && (
            <div className="response-summary">
              <span className={`status-code ${response.status >= 200 && response.status < 300 ? 'success' : response.status >= 400 ? 'error' : 'info'}`}>
                {response.status} {response.statusText || ''}
              </span>
              {response.time !== undefined && <span>Time: {response.time} ms</span>}
              {response.size !== undefined && <span>Size: {response.size} B</span>}
            </div>
          )}

          {response?.contentType?.includes('text/html') ? (
            <div>
              <div className="response-tabs">
                <button
                  className={htmlViewMode === 'preview' ? 'active' : ''}
                  onClick={() => setHtmlViewMode('preview')}
                >
                  Preview
                </button>
                <button
                  className={htmlViewMode === 'raw' ? 'active' : ''}
                  onClick={() => setHtmlViewMode('raw')}
                >
                  Raw HTML
                </button>
              </div>
              {htmlViewMode === 'preview' ? (
                <iframe
                  srcDoc={scrapeMode && response.data ? response.data : undefined}
                  src={!scrapeMode && response.originalUrl ? response.originalUrl : undefined}
                  title="Response Content"
                  style={{ width: '100%', height: '400px', border: '1px solid var(--border-color)' }}
                ></iframe>
              ) : (
                <SyntaxHighlighter language="html" style={docco}>
                  {response.data}
                </SyntaxHighlighter>
              )}
            </div>
          ) : (
            <div>
              {response?.error ? (
                <SyntaxHighlighter language="json" style={docco}>
                  {JSON.stringify({ error: response.error }, null, 2)}
                </SyntaxHighlighter>
              ) : response?.data ? (
                typeof response.data === 'object' ? (
                  <SyntaxHighlighter language="json" style={docco}>
                    {JSON.stringify(response.data, null, 2)}
                  </SyntaxHighlighter>
                ) : (
                  <SyntaxHighlighter language="plaintext" style={docco}>
                    {response.data}
                  </SyntaxHighlighter>
                )
              ) : (
                <pre>No response yet.</pre>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Move social links here */} 
      <div className="social-links">
      <div className="social-links-container">
          <h3>Connect</h3>
          <div className="social-icons">
            <a href="https://github.com/bikash1376" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/bikash1376" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://x.com/bikash1376" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
          </div>
        </div>
        </div>
    </div>
  );
}

export default App;
