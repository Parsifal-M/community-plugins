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
import express from 'express';
import { LoggerService, UrlReaderService } from '@backstage/backend-plugin-api';
import { readPolicyFile } from '../../lib/read';

export const policyContentRouter = (
  logger: LoggerService,
  urlReader: UrlReaderService,
): express.Router => {
  const router = express.Router();

  router.get('/get-policy', async (req, res, next) => {
    const opaPolicy = req.query.opaPolicy as string;

    if (!opaPolicy) {
      logger.error(
        'No OPA policy provided! Please check the open-policy-agent/policy annotation and provide a URL to the policy file.',
      );
    }

    try {
      // Fetch the content of the policy file
      logger.debug(`Fetching policy file from ${opaPolicy}`);
      const opaPolicyContent = await readPolicyFile(urlReader, opaPolicy);

      return res.json({ opaPolicyContent });
    } catch (error) {
      logger.error('An error occurred trying to fetch the policy file:', error);
      return next(error);
    }
  });

  return router;
};
