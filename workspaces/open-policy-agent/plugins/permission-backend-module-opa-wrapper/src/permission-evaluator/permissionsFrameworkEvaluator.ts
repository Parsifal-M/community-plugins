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
import {
  PolicyDecision,
  AuthorizeResult,
  PermissionCondition,
  PermissionCriteria,
  PermissionRuleParams,
} from '@backstage/plugin-permission-common';
import { OpaClient } from '../opa-client/opaClient';
import {
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { PermissionsFrameworkPolicyInput } from '../types';
import { LoggerService } from '@backstage/backend-plugin-api';

export const policyEvaluator = (
  opaClient: OpaClient,
  logger: LoggerService,
  opaEntryPoint?: string,
) => {
  return async (
    request: PolicyQuery,
    user: PolicyQueryUser,
  ): Promise<PolicyDecision> => {
    const input: PermissionsFrameworkPolicyInput = {
      permission: {
        name: request.permission.name,
      },
      identity: {
        user: user.info.userEntityRef,
        claims: user.info.ownershipEntityRefs ?? [],
      },
    };

    try {
      const response = await opaClient.evaluatePermissionsFrameworkPolicy(
        input,
        opaEntryPoint,
      );

      if (!response) {
        logger.error(
          'The result is missing in the response from OPA, are you sure the policy is loaded?',
        );
        throw new Error(
          'The result is missing in the response from OPA, are you sure the policy is loaded?',
        );
      }

      if (response.result === 'CONDITIONAL') {
        if (!response.conditions) {
          logger.error('Conditions are missing for CONDITIONAL decision');
          throw new Error('Conditions are missing for CONDITIONAL decision');
        }
        if (!response.pluginId) {
          logger.error('PluginId is missing for CONDITIONAL decision');
          throw new Error('PluginId is missing for CONDITIONAL decision');
        }
        if (!response.resourceType) {
          logger.error('ResourceType is missing for CONDITIONAL decision');
          throw new Error('ResourceType is missing for CONDITIONAL decision');
        }

        return {
          result: AuthorizeResult.CONDITIONAL,
          pluginId: response.pluginId,
          resourceType: response.resourceType,
          conditions: response.conditions as PermissionCriteria<
            PermissionCondition<string, PermissionRuleParams>
          >,
        };
      }

      if (response.result !== 'ALLOW') {
        return { result: AuthorizeResult.DENY };
      }

      return { result: AuthorizeResult.ALLOW };
    } catch (error: unknown) {
      throw error;
    }
  };
};
