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
import { LoggerService } from '@backstage/backend-plugin-api';
import { EntityCheckerApi } from '../../api/EntityCheckerApi';
import { Entity } from '@backstage/catalog-model';

export const entityCheckerRouter = (
  logger: LoggerService,
  opa: EntityCheckerApi,
): express.Router => {
  const router = express.Router();

  router.post('/entity-checker', async (req, res, next) => {
    const entityMetadata = req.body.input as Entity;

    if (!entityMetadata) {
      logger.error('Entity metadata is missing!');
    }

    try {
      const opaResponse = await opa.checkEntity({
        entityMetadata: entityMetadata,
      });
      return res.json(opaResponse);
    } catch (error) {
      logger.error(
        'An error occurred trying to send entity metadata to OPA:',
        error,
      );
      return next(error);
    }
  });

  return router;
};
