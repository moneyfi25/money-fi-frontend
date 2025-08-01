import axios from "axios";
import api from "./api";

const API_BASE_URL = "http://127.0.0.1:5000";

export const sendUserInputs = async (userInputs) => {
  try {
    // Start the processing
    const response = await api.post("/startTask", {
      user_inputs: userInputs,
    });
    console.log("🔄 Task started:", response.data);

    const taskId = response.data.task_id;

    // Poll for results
    return await pollForResult(taskId);
  } catch (error) {
    console.error("❌ Error starting task:", error);
    throw error;
  }
};

const pollForResult = async (taskId, maxAttempts = 30, interval = 10000) => {
  console.log(`🔍 Starting to poll for task: ${taskId}`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `📡 Polling attempt ${attempt}/${maxAttempts} for task: ${taskId}`
      );

      const response = await axios.get(`${API_BASE_URL}/getResult/${taskId}`);

      console.log(`📡 Poll response:`, response.data);

      if (response.data.status === "completed") {
        console.log("✅ Task completed successfully!");
        console.log("🎯 Final result:", response.data.result);
        return response.data;
      } else if (response.data.status === "error") {
        console.error("❌ Task failed:", response.data.error);
        throw new Error(response.data.error);
      } else if (response.data.status === "processing") {
        console.log("⏳ Task still processing...");
      }

      // Wait before next poll
      console.log(`⏸️ Waiting ${interval / 1000} seconds before next poll...`);
      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      if (error.response && error.response.status === 202) {
        // 202 means still processing, continue polling
        console.log("⏳ Task still processing (202 status)...");
      } else if (error.response && error.response.status === 404) {
        console.error("❌ Task not found");
        throw new Error("Task not found");
      } else {
        console.error(`❌ Polling error on attempt ${attempt}:`, error);
        throw error;
      }
    }
  }

  console.error("⏰ Task timeout - took too long to complete");
  throw new Error("Task timeout - took too long to complete");
};
