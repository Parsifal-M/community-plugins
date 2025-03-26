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
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { rootRouteRef } from './routes';
import { opaApiRef, OpaClient } from './api';

export const opaPoliciesPlugin = createPlugin({
  id: 'opa-policies',
  apis: [
    createApiFactory({
      api: opaApiRef,
      deps: {
        fetchApi: fetchApiRef,
      },
      factory: ({ fetchApi }) => new OpaClient({ fetchApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const OpaPolicyPage = opaPoliciesPlugin.provide(
  createRoutableExtension({
    name: 'OpaPolicyPage',
    component: () =>
      import('./components/OpaPolicyComponent').then(m => m.OpaPolicyPage),
    mountPoint: rootRouteRef,
  }),
);

export const isOpaPoliciesEnabled = (entity: Entity) => {
  return Boolean(entity?.metadata.annotations?.['open-policy-agent/policy']);
};
