// FIX: Import `ReactNode` from `react` to fix the 'Cannot find namespace React' error.
import { ReactNode } from 'react';

export interface DecisionPoint {
  question: string;
  options: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string | ReactNode;
  decision?: DecisionPoint;
}

export enum ConversationState {
  GATHERING_INFO = 'GATHERING_INFO',
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
  GENERATING_SCRIPT = 'GENERATING_SCRIPT',
  AWAITING_DECISION = 'AWAITING_DECISION',
  COMPLETED = 'COMPLETED'
}

export interface Scene {
    sceneNumber: number;
    visuals: string;
    dialogue: string;
}

export interface ScriptData {
    targetAudience: string;
    coreCreativeHook: string;
    storyline: Scene[];
    emotionalValuePoints: string[];
    callToAction: string;
}