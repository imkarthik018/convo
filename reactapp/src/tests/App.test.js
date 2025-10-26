import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

// ✅ Mock API services
jest.mock("../services/api", () => ({
  addConversation: jest.fn(),
  getAllConversations: jest.fn(),
  getConversationsByCategory: jest.fn(),
  getConversationsSortedByTime: jest.fn(),
  deleteConversation: jest.fn(),
}));

import {
  addConversation,
  getAllConversations,
  getConversationsByCategory,
  getConversationsSortedByTime,
  deleteConversation,
} from "../services/api";

describe("ChatGPT Conversation Manager App", () => {
  const mockConversations = [
    {
      id: 1,
      prompt: "What is React?",
      response: "A library for building UIs.",
      category: "Education",
      timestamp: "2025-09-01T10:00:00",
    },
    {
      id: 2,
      prompt: "Write hello world in Python",
      response: "print('Hello, World!')",
      category: "Coding",
      timestamp: "2025-09-02T12:30:00",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- Header ----------
  test("renders header title and subtitle", async () => {
    getAllConversations.mockResolvedValueOnce([]);
    render(<App />);
    expect(await screen.findByRole("heading", { name: /chatgpt conversation manager/i })).toBeInTheDocument();
    expect(screen.getByText(/organize your ai chats efficiently/i)).toBeInTheDocument();
  });

  // ---------- Empty State ----------
  test("renders empty state when no conversations", async () => {
    getAllConversations.mockResolvedValueOnce([]);
    render(<App />);
    expect(await screen.findByText(/no conversations found/i)).toBeInTheDocument();
  });

  // ---------- List Rendering ----------
  test("renders list of conversations", async () => {
    getAllConversations.mockResolvedValueOnce(mockConversations);
    render(<App />);
    expect(await screen.findByText("What is React?")).toBeInTheDocument();
    expect(screen.getByText("Write hello world in Python")).toBeInTheDocument();
  });

  // ---------- Add Conversation ----------
  test("adds a conversation when form is submitted", async () => {
    getAllConversations.mockResolvedValueOnce([]);
    addConversation.mockResolvedValueOnce({});
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/enter prompt/i), {
      target: { value: "New Prompt" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter response/i), {
      target: { value: "New Response" },
    });
    fireEvent.change(screen.getByDisplayValue("General"), {
      target: { value: "Coding" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add conversation/i }));

    await waitFor(() =>
      expect(addConversation).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: "New Prompt",
          response: "New Response",
          category: "Coding",
        })
      )
    );
  });

  // ---------- Delete Conversation ----------
  test("renders delete button and deletes conversation", async () => {
    getAllConversations.mockResolvedValueOnce(mockConversations);
    deleteConversation.mockResolvedValueOnce({});
    render(<App />);

    const deleteBtns = await screen.findAllByRole("button", { name: /delete/i });
    expect(deleteBtns.length).toBe(2);

    fireEvent.click(deleteBtns[0]);
    await waitFor(() => expect(deleteConversation).toHaveBeenCalledWith(1));
  });

  // ---------- Filtering ----------
  test("filters conversations by category", async () => {
    getAllConversations.mockResolvedValueOnce(mockConversations);
    getConversationsByCategory.mockResolvedValueOnce([mockConversations[0]]);

    render(<App />);
    fireEvent.change(await screen.findByDisplayValue("All Conversations"), {
      target: { value: "Education" },
    });

    await waitFor(() => expect(getConversationsByCategory).toHaveBeenCalledWith("Education"));
  });

  // ---------- Sorting ----------
  test("sorts conversations by time", async () => {
    getAllConversations.mockResolvedValueOnce(mockConversations);
    getConversationsSortedByTime.mockResolvedValueOnce([...mockConversations].reverse());

    render(<App />);
    fireEvent.change(await screen.findByDisplayValue("All Conversations"), {
      target: { value: "sorted" },
    });

    await waitFor(() => expect(getConversationsSortedByTime).toHaveBeenCalled());
  });

  // ---------- Input Behavior ----------
  test("typing updates the prompt field", async () => {
    getAllConversations.mockResolvedValueOnce([]);
    render(<App />);
    const input = await screen.findByPlaceholderText("Enter prompt");
    fireEvent.change(input, { target: { value: "Testing prompt" } });
    expect(input).toHaveValue("Testing prompt");
  });

  test("typing updates the response field", async () => {
    getAllConversations.mockResolvedValueOnce([]);
    render(<App />);
    const input = await screen.findByPlaceholderText("Enter response");
    fireEvent.change(input, { target: { value: "Testing response" } });
    expect(input).toHaveValue("Testing response");
  });

  test("typing updates the category dropdown", async () => {
    getAllConversations.mockResolvedValueOnce([]);
    render(<App />);
    const select = await screen.findByDisplayValue("General");
    fireEvent.change(select, { target: { value: "Career" } });
    expect(select).toHaveValue("Career");
  });

  // ---------- Dropdown Rendering ----------
  test("renders filter dropdown with default option", async () => {
    getAllConversations.mockResolvedValueOnce([]);
    render(<App />);
    expect(await screen.findByDisplayValue("All Conversations")).toBeInTheDocument();
  });

  test("renders category select in form with default General", async () => {
    getAllConversations.mockResolvedValueOnce([]);
    render(<App />);
    expect(await screen.findByDisplayValue("General")).toBeInTheDocument();
  });
});
