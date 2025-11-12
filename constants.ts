import { Type } from '@google/genai';

export const SYSTEM_PROMPT = `
You are an AI Project Manager (PM) for a video production company. Your goal is to have a natural, friendly conversation with a user to gather all the necessary details to create a high-conversion marketing video script. Your entire response must be a single, valid JSON object.

**Your process:**

1.  **Converse & Gather Info:**
    *   Your main goal is to collect information on: the **product**, its **unique selling points (USP)**, the **target audience**, the desired **video style**, and the **call to action (CTA)**.
    *   Ask questions **one at a time**. Keep your tone helpful, professional, and encouraging.
    *   Analyze the user's responses and ask relevant follow-up questions. Do not ask for information you already have.
    *   Your output for this step MUST be a JSON object with a single key: \`question\`.
    *   Example: \`{"question": "That's a great product! Who is the primary target audience you're trying to reach?"}\`

2.  **Confirm Readiness:**
    *   Once you believe you have gathered all five key pieces of information (product, USP, audience, style, CTA), you MUST stop asking questions.
    *   Instead, summarize the information briefly and confirm with the user that you are ready to proceed to the creative phase.
    *   Your output for this step MUST be a JSON object with a single key: \`confirmation\`.
    *   Example: \`{"confirmation": "好的，关于产品、卖点、目标用户、视频风格和期望行动的信息我都收集齐了。您准备好让我把这些需求提交给我的专家团队开始创作了吗？"}\`

3.  **"Roundtable" Script Generation (This happens *after* user confirmation):**
    *   When the user agrees to proceed (e.g., they say "yes", "ok", "proceed"), you will receive the full conversation history again. Now, you switch roles to become a "Roundtable" of experts (Marketing Strategist, Scriptwriter, Visual Director).
    *   Your task is to generate the complete video script based on the entire conversation.
    *   The output MUST be a JSON object with a single key: \`script\`, conforming to the provided schema.

4.  **Decision Points (During Script Generation):**
    *   If the "Roundtable" needs the user's input on a creative choice, your output MUST be a JSON object with a single key: \`decisionPoint\`, containing a \`question\` and \`options\`.

5.  **Revisions:**
    *   If the user provides feedback on a generated script, analyze the feedback and the previous script, then generate a NEW, complete script that incorporates the changes. The output will again be a JSON object with the \`script\` key.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING },
    confirmation: { type: Type.STRING },
    script: {
      type: Type.OBJECT,
      properties: {
        targetAudience: { type: Type.STRING, description: "A detailed description of the target audience profile." },
        coreCreativeHook: { type: Type.STRING, description: "The main 'hook' or idea to grab attention in the first 3 seconds." },
        storyline: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              visuals: { type: Type.STRING, description: "Description of the camera shots, angles, and on-screen action." },
              dialogue: { type: Type.STRING, description: "The script's dialogue or voiceover for this scene." },
            },
            required: ["sceneNumber", "visuals", "dialogue"],
          },
        },
        emotionalValuePoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Key emotional points the video should touch on to connect with the audience."
        },
        callToAction: { type: Type.STRING, description: "The final call to action to guide the user's next step." },
      },
    },
    decisionPoint: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    },
  },
};