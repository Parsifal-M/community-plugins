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
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { RequireOpaAuthz } from './RequireOpaAuthz';
import { useOpaAuthz } from '../../hooks/useOpaAuthz/useOpaAuthz';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { opaAuthzBackendApiRef } from '../../api';

// Mock the useOpaAuthz hook
jest.mock('../../hooks/useOpaAuthz/useOpaAuthz');

const mockOpaBackendApi = {
  evalPolicy: jest.fn().mockResolvedValue({ result: { allow: true } }),
};

describe('RequireOpaAuthz', () => {
  const mockInput = { user: 'test-user', action: 'read', resource: 'document' };
  const mockEntryPoint = 'example/allow';

  it('renders null when loading', async () => {
    (useOpaAuthz as jest.Mock).mockReturnValue({ loading: true, data: null });

    renderInTestApp(
      <TestApiProvider apis={[[opaAuthzBackendApiRef, mockOpaBackendApi]]}>
        <RequireOpaAuthz input={mockInput} entryPoint={mockEntryPoint}>
          <div>Protected Content</div>
        </RequireOpaAuthz>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).toBeNull();
    });
  });

  it('renders null when there is an error', async () => {
    (useOpaAuthz as jest.Mock).mockReturnValue({
      loading: false,
      data: null,
      error: new Error('Error'),
    });

    renderInTestApp(
      <TestApiProvider apis={[[opaAuthzBackendApiRef, mockOpaBackendApi]]}>
        <RequireOpaAuthz input={mockInput} entryPoint={mockEntryPoint}>
          <div>Protected Content</div>
        </RequireOpaAuthz>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).toBeNull();
    });
  });

  it('renders null when access is not allowed', async () => {
    (useOpaAuthz as jest.Mock).mockReturnValue({
      loading: false,
      data: { result: { allow: false } },
    });

    renderInTestApp(
      <TestApiProvider apis={[[opaAuthzBackendApiRef, mockOpaBackendApi]]}>
        <RequireOpaAuthz input={mockInput} entryPoint={mockEntryPoint}>
          <div>Protected Content</div>
        </RequireOpaAuthz>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).toBeNull();
    });
  });

  it('renders children when access is allowed', async () => {
    (useOpaAuthz as jest.Mock).mockReturnValue({
      loading: false,
      data: { result: { allow: true } },
    });

    renderInTestApp(
      <TestApiProvider apis={[[opaAuthzBackendApiRef, mockOpaBackendApi]]}>
        <RequireOpaAuthz input={mockInput} entryPoint={mockEntryPoint}>
          <div>Protected Content</div>
        </RequireOpaAuthz>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
