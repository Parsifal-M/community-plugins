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
import { Entity } from '@backstage/catalog-model';
import { OpaBackendApi, OpaEntityResult } from './types';
import { createApiRef, FetchApi } from '@backstage/core-plugin-api';

export const opaApiRef = createApiRef<OpaBackendApi>({
  id: 'plugin.opa-entity-checker.service',
});

export class OpaClient implements OpaBackendApi {
  private readonly fetchApi: FetchApi;
  constructor(options: { fetchApi: FetchApi }) {
    this.fetchApi = options.fetchApi;
  }
  private async handleResponse(response: Response): Promise<OpaEntityResult> {
    if (!response.ok) {
      const message = `Error ${response.status}: ${response.statusText}.`;

      try {
        const responseBody = await response.json();
        throw new Error(
          `${message} Details: ${
            responseBody.error || 'No additional details provided.'
          }`,
        );
      } catch (error) {
        throw new Error(message);
      }
    }

    const data = await response.json();
    return data as OpaEntityResult;
  }

  async entityCheck(entityMetadata: Entity): Promise<OpaEntityResult> {
    const url = `plugin://opa/entity-checker`;
    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: entityMetadata }),
    });
    return await this.handleResponse(response);
  }
}
