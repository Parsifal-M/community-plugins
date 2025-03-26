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
import { OpaMetadataEntityResult } from '../api/types';

export const getPassStatus = (violations: OpaMetadataEntityResult[] = []) => {
  const errors = violations.filter(v => v.level === 'error').length;
  const warnings = violations.filter(v => v.level === 'warning').length;
  const infos = violations.filter(v => v.level === 'info').length;

  if (errors > 0) {
    return 'ERROR';
  } else if (warnings > 0) {
    return 'WARNING';
  } else if (infos > 0) {
    return 'INFO';
  }
  return 'PASS';
};
