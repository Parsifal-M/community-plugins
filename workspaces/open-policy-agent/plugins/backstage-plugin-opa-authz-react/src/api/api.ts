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
import { ApiRef, createApiRef, FetchApi } from '@backstage/core-plugin-api';
import { OpaAuthzApi, PolicyInput, PolicyResult } from './types';

export const opaAuthzBackendApiRef: ApiRef<OpaAuthzApi> =
  createApiRef<OpaAuthzApi>({
    id: 'plugin.opa-authz.api',
  });

export class OpaAuthzClientReact implements OpaAuthzApi {
  private readonly fetchApi: FetchApi;
  constructor(options: { fetchApi: FetchApi }) {
    this.fetchApi = options.fetchApi;
  }

  async evalPolicy(
    input: PolicyInput,
    entryPoint: string,
  ): Promise<PolicyResult> {
    const url = `plugin://opa/opa-authz`;

    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, entryPoint }),
    });

    if (!response.ok) {
      const message = `Error ${response.status}: ${response.statusText}.`;

      try {
        const responseBody = await response.json();
        throw new Error(`${message} ${responseBody.error}`);
      } catch (error) {
        throw new Error(message);
      }
    }
    return response.json();
  }
}
