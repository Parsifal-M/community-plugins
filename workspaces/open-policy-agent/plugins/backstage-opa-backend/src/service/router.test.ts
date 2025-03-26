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
import { mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';

const mockEntityCheckerApi = {
  checkEntity: jest.fn(),
};

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        data: {
          opaClient: {
            baseUrl: 'http://localhost:8181',
          },
        },
      },
    });
    const router = await createRouter({
      config: mockConfig,
      logger: mockServices.logger.mock(),
      urlReader: mockServices.urlReader.mock(),
      httpAuth: mockServices.httpAuth.mock(),
      userInfo: mockServices.userInfo.mock(),
      opaEntityChecker: mockEntityCheckerApi,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
