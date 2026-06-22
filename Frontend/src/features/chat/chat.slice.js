import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../auth/auth.slice";
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// chats = {
//   "docker and AWS": {
//     messages: [
//       { role: "user", content: "how to deploy docker container on AWS?" },
//       {
//         role: "ai",
//         content:
//           "To deploy a Docker container on AWS, you can use Amazon Elastic Container Service (ECS) or Amazon Elastic Kubernetes Service (EKS). Here are the general steps to deploy using ECS: 1. Create a Docker image of your application and push it to Amazon Elastic Container Registry (ECR). 2. Create an ECS cluster. 3. Define a task definition that specifies the Docker image and resource requirements. 4. Create a service that runs the task definition on the cluster. 5. Configure load balancing and scaling as needed. For EKS, you would set up a Kubernetes cluster and deploy your Docker container using Kubernetes manifests. Both services provide detailed documentation to guide you through the process.",
//       },
//     ],
//     id: "docker and AWS",
//     lastUpdated: "2024-06-01T12:00:00Z",
//   },
// };
