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
import { useApi } from '@backstage/core-plugin-api';
import { opaAuthzBackendApiRef } from '../../api';
import { PolicyInput, PolicyResult } from '../../api/types';
import useSWR from 'swr';

export type AsyncOpaAuthzResult = {
  loading: boolean;
  data: PolicyResult | null;
  error?: Error;
};

export function useOpaAuthz(
  input: PolicyInput,
  entryPoint: string,
): AsyncOpaAuthzResult {
  const opaAuthzBackendApi = useApi(opaAuthzBackendApiRef);

  const { data, error } = useSWR(input, async (authzInput: PolicyInput) => {
    return await opaAuthzBackendApi.evalPolicy(authzInput, entryPoint);
  });

  if (error) {
    return { error, loading: false, data: null };
  }

  if (!data?.result) {
    return { loading: true, data: null };
  }

  return { loading: false, data: data };
}
