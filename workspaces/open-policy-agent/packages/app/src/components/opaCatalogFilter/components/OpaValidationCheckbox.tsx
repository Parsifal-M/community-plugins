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
import { useEntityList } from '@backstage/plugin-catalog-react';
import {
  FormControl,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import React from 'react';
import {
  CustomFilters,
  OpaValidationFilter,
} from '../custom-filters/opaCatalogFilter';

const statusMapping = {
  info: 'Info',
  warning: 'Warning',
  error: 'Error',
} as const;

type ValidationStatus = keyof typeof statusMapping;

export const EntityOpaValidationPicker = () => {
  const {
    filters: { opaValidationStatus },
    updateFilters,
  } = useEntityList<CustomFilters>();

  function onChange(value: ValidationStatus) {
    const newStatus = opaValidationStatus?.values.includes(value)
      ? opaValidationStatus.values.filter(status => status !== value)
      : [...(opaValidationStatus?.values ?? []), value];
    updateFilters({
      opaValidationStatus: newStatus.length
        ? new OpaValidationFilter(newStatus)
        : undefined,
    });
  }

  const statusOptions: ValidationStatus[] = ['info', 'warning', 'error'];

  return (
    <FormControl component="fieldset">
      <Typography variant="button">Validation Status</Typography>
      <FormGroup>
        {statusOptions.map(status => (
          <FormControlLabel
            key={status}
            control={
              <Checkbox
                checked={opaValidationStatus?.values.includes(status)}
                onChange={() => onChange(status)}
              />
            }
            label={`${statusMapping[status]}`}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};
