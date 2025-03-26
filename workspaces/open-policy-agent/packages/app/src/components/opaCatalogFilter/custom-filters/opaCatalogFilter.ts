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
import { EntityFilter } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { DefaultEntityFilters } from '@backstage/plugin-catalog-react';

export type CustomFilters = DefaultEntityFilters & {
  opaValidationStatus?: OpaValidationFilter;
};

export class OpaValidationFilter implements EntityFilter {
  constructor(readonly values: string[]) {}
  filterEntity(entity: Entity): boolean {
    const opaValidationStatus =
      entity.metadata.annotations?.[
        'open-policy-agent/entity-checker-validation-status'
      ];
    return (
      opaValidationStatus !== undefined &&
      this.values.includes(opaValidationStatus)
    );
  }
}
