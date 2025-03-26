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
import { PolicyDecision } from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { OpaClient } from './opa-client';
import { LoggerService } from '@backstage/backend-plugin-api';
import { policyEvaluator } from './permission-evaluator';

export class OpaPermissionPolicy implements PermissionPolicy {
  private opaClient: OpaClient;
  private logger: LoggerService;

  constructor(opaClient: OpaClient, logger: LoggerService) {
    this.opaClient = opaClient;
    this.logger = logger;
  }

  async handle(
    request: PolicyQuery,
    user: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    const opaRbacPolicy = policyEvaluator(this.opaClient, this.logger);
    return await opaRbacPolicy(request, user);
  }
}
