"use server";

import { Anthropic } from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserStatistics } from "@/lib/statistics";
import { getUserAchievements, getAchievementStats } from "@/lib/achievements";
import { getRemainingLifelines } from "@/lib/lifelines";

const client = new Anthropic();

/**
 * Tool definitions for Claude to interact with the app
 */
const TOOLS: Anthropic.Tool[] = [
  {
    name: "get_user_profile",
    description: "Get the current user's profile information",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_active_goals",
    description: "Get all active goals for the user",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_statistics",
    description: "Get user statistics including reliability, streaks, and goal counts",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_achievements",
    description: "Get user achievements and progress",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_lifelines",
    description: "Get remaining lifelines for the user",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

/**
 * Process tool calls from Claude
 */
async function processTool(
  toolName: string,
  userId: string,
  _input: Record<string, unknown>
): Promise<string> {
  switch (toolName) {
    case "get_user_profile": {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, profession: true },
      });
      return JSON.stringify(user);
    }

    case "get_active_goals": {
      const goals = await prisma.goal.findMany({
        where: { userId, status: "ACTIVE" },
        select: {
          id: true,
          title: true,
          description: true,
          deadline: true,
          category: true,
        },
      });
      return JSON.stringify(goals);
    }

    case "get_statistics": {
      const stats = await getUserStatistics(userId);
      return JSON.stringify(stats);
    }

    case "get_achievements": {
      const achievements = await getUserAchievements(userId);
      const stats = await getAchievementStats(userId);
      return JSON.stringify({ achievements, stats });
    }

    case "get_lifelines": {
      const remaining = await getRemainingLifelines(userId);
      return JSON.stringify({ remaining, total: 7 });
    }

    default:
      return JSON.stringify({ error: "Unknown tool" });
  }
}

/**
 * Chat with Claude about the app
 */
export async function chatWithAI(
  userMessage: string
): Promise<{ response: string; requiresConfirmation?: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { response: "You must be signed in to use the AI assistant." };
  }

  // Save user message
  await prisma.aIMessage.create({
    data: {
      userId: session.user.id,
      role: "user",
      content: userMessage,
    },
  });

  // Get user context for system prompt
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, profession: true },
  });

  const systemPrompt = `You are the AI assistant for Reckon, a goal-accountability platform. You help users track their goals, consequences, achievements, and streaks.

Current user: ${user?.name} (${user?.profession})

You have access to tools to:
- Get user profile and statistics
- View active goals and achievements
- Check remaining lifelines

IMPORTANT: You are helpful, conversational, and supportive. You understand that accountability can be tough, so be encouraging.
Keep responses concise and friendly. When users ask about their goals or progress, use the available tools to give them accurate information.

Do NOT make up data or create new goals/consequences - only view existing data.
If the user asks you to create a goal or take an action, respond with what you would do and ask for confirmation in your message (don't use tool calling for actions).`;

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      system: systemPrompt,
      tools: TOOLS,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    // Process tool uses if any
    let assistantMessage = "";
    const toolUses: Array<{ name: string; input: Record<string, unknown> }> = [];

    for (const block of response.content) {
      if (block.type === "text") {
        assistantMessage = block.text;
      } else if (block.type === "tool_use") {
        toolUses.push({ name: block.name, input: block.input as Record<string, unknown> });
      }
    }

    // Execute tools if needed
    if (toolUses.length > 0) {
      const toolResults: Anthropic.MessageParam[] = [];

      for (const tool of toolUses) {
        const result = await processTool(tool.name, session.user.id, tool.input);
        toolResults.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: tool.name,
              content: result,
            },
          ],
        });
      }

      // Get final response with tool results
      const finalResponse = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: systemPrompt,
        tools: TOOLS,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
          {
            role: "assistant",
            content: response.content,
          },
          ...toolResults,
        ],
      });

      for (const block of finalResponse.content) {
        if (block.type === "text") {
          assistantMessage = block.text;
        }
      }
    }

    // Save assistant response
    await prisma.aIMessage.create({
      data: {
        userId: session.user.id,
        role: "assistant",
        content: assistantMessage,
      },
    });

    return { response: assistantMessage };
  } catch (error) {
    console.error("AI chat error:", error);
    return {
      response:
        "Sorry, I encountered an error. Please try again or contact support.",
    };
  }
}

/**
 * Get chat history for a user
 */
export async function getChatHistory(userId: string, limit = 50) {
  return prisma.aIMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}
