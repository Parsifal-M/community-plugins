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
import { policyContentRouter } from './policyContent';
import { readPolicyFile } from '../../lib/read';

jest.mock('node-fetch');
jest.mock('../../lib/read');

describe('policyContentRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const mockUrlReader = mockServices.urlReader.mock();
    const mockLogger = mockServices.logger.mock();

    const router = policyContentRouter(mockLogger, mockUrlReader);
    app = express().use(express.json()).use(router);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /get-policy', () => {
    it('should return the content of the policy file', async () => {
      (readPolicyFile as jest.Mock).mockResolvedValue('test-policy-content');

      const response = await request(app).get(
        '/get-policy?opaPolicy=test-policy-url',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        opaPolicyContent: 'test-policy-content',
      });
    });
  });
});
