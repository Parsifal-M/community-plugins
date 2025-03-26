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
import { waitFor, renderHook } from '@testing-library/react';
import { useOpaAuthz } from './useOpaAuthz';
import { useApi } from '@backstage/core-plugin-api';
import { OpaAuthzApi } from '../../api';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

describe('useOpaAuthz', () => {
  const mockEvalPolicy = jest.fn();

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      evalPolicy: mockEvalPolicy,
    } as unknown as OpaAuthzApi);
  });

  it('should return the policy result', async () => {
    mockEvalPolicy.mockResolvedValue({ result: { allow: true } });

    const { result } = renderHook(() =>
      useOpaAuthz({ entity: 'test' }, 'test'),
    );

    await waitFor(() => result.current.data !== null);

    expect(result.current.data).toEqual({ result: { allow: true } });
  });
});
