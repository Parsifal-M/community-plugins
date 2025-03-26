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
import Router from 'express-promise-router';
import {
  HttpAuthService,
  LoggerService,
  UrlReaderService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { entityCheckerRouter } from './routers/entityChecker';
import { policyContentRouter } from './routers/policyContent';
import { authzRouter } from './routers/authz';
import { Config } from '@backstage/config';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { EntityCheckerApi } from '../api/EntityCheckerApi';

export type RouterOptions = {
  logger: LoggerService;
  config: Config;
  urlReader: UrlReaderService;
  httpAuth: HttpAuthService;
  userInfo: UserInfoService;
  opaEntityChecker: EntityCheckerApi;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, urlReader, httpAuth, userInfo, opaEntityChecker } =
    options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.use(entityCheckerRouter(logger, opaEntityChecker));
  router.use(authzRouter(logger, config, httpAuth, userInfo));
  router.use(policyContentRouter(logger, urlReader));

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());
  return router;
}
