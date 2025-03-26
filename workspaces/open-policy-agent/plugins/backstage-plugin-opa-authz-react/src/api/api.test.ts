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
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { MockFetchApi, registerMswTestHooks } from '@backstage/test-utils';
import { OpaAuthzClientReact } from './api';
import { PolicyInput, PolicyResult } from './types';

const mockBaseUrl = 'http://mock';
const server = setupServer();

describe('OpaAuthzClientReact', () => {
  registerMswTestHooks(server);
  const fetchApi = new MockFetchApi({
    resolvePluginProtocol: {
      discoveryApi: {
        getBaseUrl: async () => mockBaseUrl,
      },
    },
  });

  let client: OpaAuthzClientReact;

  beforeEach(() => {
    client = new OpaAuthzClientReact({ fetchApi });
  });

  describe('evalPolicy', () => {
    it('should call the correct endpoint', async () => {
      const input: PolicyInput = {
        user: 'test-user',
        action: 'read',
        resource: 'document',
      };
      const entryPoint = 'example/allow';
      const mockResponse: PolicyResult = {
        decision_id: '12345',
        result: { allow: true },
      };

      server.use(
        rest.post(`${mockBaseUrl}/opa-authz`, async (req, res, ctx) => {
          const requestBody = await req.json();
          expect(requestBody).toEqual({ input, entryPoint });
          return res(ctx.json(mockResponse));
        }),
      );

      const response = await client.evalPolicy(input, entryPoint);
      expect(response).toEqual(mockResponse);
    });

    it('should throw an error on unsuccessful response with details', async () => {
      const input: PolicyInput = {
        user: 'test-user',
        action: 'read',
        resource: 'document',
      };
      const entryPoint = 'example/allow';
      const mockErrorResponse = { error: 'Some error details' };

      server.use(
        rest.post(`${mockBaseUrl}/opa-authz`, async (_req, res, ctx) => {
          return res(ctx.status(400), ctx.json(mockErrorResponse));
        }),
      );

      await expect(client.evalPolicy(input, entryPoint)).rejects.toThrow(
        'Error 400: Bad Request.',
      );
    });

    it('should throw an error on unsuccessful response without details', async () => {
      const input: PolicyInput = {
        user: 'test-user',
        action: 'read',
        resource: 'document',
      };
      const entryPoint = 'example/allow';

      server.use(
        rest.post(`${mockBaseUrl}/opa-authz`, async (_req, res, ctx) => {
          return res(ctx.status(500), ctx.text('Internal Server Error'));
        }),
      );

      await expect(client.evalPolicy(input, entryPoint)).rejects.toThrow(
        'Error 500: Internal Server Error.',
      );
    });
  });
});
