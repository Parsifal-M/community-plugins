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
  coreServices,
  createBackendPlugin,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { EntityCheckerApi, EntityCheckerApiImpl } from './api/EntityCheckerApi';

/**
 * entityCheckerServiceRef expose the OPA Entity Checker implementation so that it can be used by other plugins
 */
export const entityCheckerServiceRef = createServiceRef<EntityCheckerApi>({
  id: 'opa.entity-checker',
  scope: 'plugin',
  defaultFactory: async service =>
    createServiceFactory({
      service: service,
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async factory({ logger, config }) {
        return new EntityCheckerApiImpl({
          logger: logger,
          opaBaseUrl: config.getOptionalString('opaClient.baseUrl'),
          entityCheckerEntrypoint: config.getOptionalString(
            'opaClient.policies.entityChecker.entrypoint',
          ),
        });
      },
    }),
});

export const opaPlugin = createBackendPlugin({
  pluginId: 'opa',
  register(env) {
    env.registerInit({
      deps: {
        catalogApi: catalogServiceRef,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        urlReader: coreServices.urlReader,
        userInfo: coreServices.userInfo,
        opaEntityChecker: entityCheckerServiceRef,
      },
      async init({
        config,
        logger,
        httpRouter,
        httpAuth,
        urlReader,
        userInfo,
        opaEntityChecker,
      }) {
        httpRouter.use(
          await createRouter({
            config,
            logger,
            httpAuth,
            urlReader,
            userInfo,
            opaEntityChecker,
          }),
        );

        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
