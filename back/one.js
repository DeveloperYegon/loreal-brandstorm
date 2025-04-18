const express = require('express');
const app = express();
const port = 5000;
const cors =require('cors');
const bodyParser = require('body-parser');
// const {ChatOpenAI} =require("@langchain/openai")
const {ChatGoogleGenerativeAI}=require("@langchain/google-genai")
require("dotenv").config();
const {START, END, MessagesAnnotation, StateGraph,MemorySaver}= require("@langchain/langgraph");
const {v4:uuidv4}= require("uuid");

//middleware
app.use(cors());
app.use(bodyParser.json());

//langchain setup
const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0,
    streaming: false,
  });

  const callModel = async (state) => {
    try {
    const response = await llm.invoke(state.messages);


    if (!response || !response.content) {
      throw new Error("Invalid response from Gemini API");
  }

    const formattedResponse = {
      role: "ai",  // Ensuring correct role
      content: response.content || "No response generated",// Extracting content correctly
  };
    return { messages: [...state.messages, formattedResponse]  }; // Append to conversation history
  }catch (error) {
    console.error("Error calling LLM:", error);
    throw new Error("Failed to generate response");
  }
};


  const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", "model");

  const memory = new MemorySaver();
const appWorkflow = workflow.compile({ checkpointer: memory });

// Endpoint for chatbot
app.post("/chat", async (req, res) => {
  const { messages ,thread_id} = req.body;
  console.log("Received messages:", messages);

  if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid input format" });
  }
  const config = { configurable: { thread_id:thread_id|| uuidv4() } };

  try {
    const output = await appWorkflow.invoke({ messages }, config);
    const aiResponse = output.messages[output.messages.length - 1];
    return res.json({ kwargs: { content: aiResponse.content, thread_id: config.configurable.thread_id } });

  } catch (error) {
    console.error("Error during chatbot processing:", error);
    return res.status(500).json({ error: "Failed to process the request" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});