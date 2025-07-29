import React, { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

const resources = ["tenants", "workbenches", "requests", "tasks", "queues", "roles", "agents"];

const samplePrompts = [
  "List all tenants in our Operations Center.",
  "Show me pending tasks for tenant ID 42.",
  "Compute SLA health for request 1234.",
  "Summarize the details of task 5678.",
  "What roles does agent ‘Alice’ currently have?",
];

function App() {
  const [selectedResource, setSelectedResource] = useState(resources[0]);
  const [params, setParams] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{user: string, bot: string}[]>([]);

  // Example: Call MCP server
  const handleInvoke = async () => {
    // TODO: Replace with actual MCP server call
    alert(`Invoked ${selectedResource} with params: ${params}`);
  };

  // Example: Call LLM server
  const handleChat = async () => {
    setChatHistory([...chatHistory, {user: chatInput, bot: "..." }]);
    const res = await axios.post("http://localhost:8000/chat", { prompt: chatInput });
    setChatHistory([...chatHistory, {user: chatInput, bot: res.data.response }]);
    setChatInput("");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer variant="permanent" anchor="left">
        <List>
          {resources.map((res) => (
            <ListItem key={res} disablePadding>
              <ListItemButton selected={selectedResource === res} onClick={() => setSelectedResource(res)}>
                <ListItemText primary={res.charAt(0).toUpperCase() + res.slice(1)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Panel */}
      <Box sx={{ flex: 1, p: 3, ml: "240px" }}>
        <Typography variant="h5">{selectedResource.charAt(0).toUpperCase() + selectedResource.slice(1)}</Typography>
        <TextField
          label="Parameters (JSON or key=value)"
          value={params}
          onChange={e => setParams(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleInvoke}>Invoke</Button>

        <Box mt={4}>
          <Typography variant="h6">Sample Prompts</Typography>
          <List>
            {samplePrompts.map((prompt, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemButton onClick={() => setChatInput(prompt)}>
                  <ListItemText primary={prompt} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Chat Panel */}
      <Box sx={{ width: 400, p: 2, borderLeft: "1px solid #eee", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">LLM Chat</Typography>
        <Paper sx={{ flex: 1, p: 2, mb: 2, overflowY: "auto" }}>
          {chatHistory.map((msg, idx) => (
            <Box key={idx} mb={2}>
              <Typography variant="body2" color="primary">{msg.user}</Typography>
              <Typography variant="body1">{msg.bot}</Typography>
            </Box>
          ))}
        </Paper>
        <TextField
          label="Ask the LLM"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          fullWidth
          onKeyDown={e => { if (e.key === "Enter") handleChat(); }}
        />
        <Button variant="outlined" onClick={handleChat} sx={{ mt: 1 }}>Send</Button>
      </Box>
    </Box>
  );
}

export default App;
