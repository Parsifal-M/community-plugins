/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export type PolicyInput = Record<string, unknown>;

/**
 * Represents the result of a policy evaluation.
 *
 * @property {string} decision_id - A unique identifier for the decision, useful for tracking and auditing purposes.
 * @property {object} result - The outcome of the policy evaluation.
 * @property {boolean} result.allow - Indicates whether the action is allowed based on the policy evaluation.
 *
 * @example
 * const result: PolicyResult = {
 *   decision_id: "abc-123-def-456",
 *   result: {
 *     allow: true
 *   }
 * };
 */
export type PolicyResult = {
  decision_id: string;
  result: {
    allow: boolean;
  };
};

export type PermissionsFrameworkPolicyInput = {
  permission: {
    name: string;
  };
  identity?: {
    user: string | undefined;
    claims: string[];
  };
};

export type PermissionsFrameworkPolicyEvaluationResult = {
  result: string;
  pluginId?: string;
  resourceType?: string;
  conditions?: {
    anyOf?: {
      params: {
        [key: string]: any;
      };
      resourceType: string;
      rule: string;
    }[];
    allOf?: {
      params: {
        [key: string]: any;
      };
      resourceType: string;
      rule: string;
    }[];
    none?: {
      params: {
        [key: string]: any;
      };
      resourceType: string;
      rule: string;
    }[];
  };
};

export type PolicyEvaluationResponse = {
  result: PermissionsFrameworkPolicyEvaluationResult;
};

export type FallbackPolicyDecision = 'allow' | 'deny' | undefined;
