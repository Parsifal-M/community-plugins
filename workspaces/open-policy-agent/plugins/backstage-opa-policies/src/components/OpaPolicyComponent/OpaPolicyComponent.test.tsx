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
import { screen } from '@testing-library/react';
import { OpaPolicyPage } from './OpaPolicyComponent';
import { opaApiRef } from '../../api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React, { act } from 'react';
import { alertApiRef } from '@backstage/core-plugin-api';

jest.mock('@backstage/plugin-catalog-react', () => ({
  ...jest.requireActual('@backstage/plugin-catalog-react'),
  useEntity: () => ({
    entity: {
      metadata: {
        name: 'TestEntity',
        annotations: {
          'open-policy-agent/policy': 'test-policy',
        },
      },
    },
  }),
}));

const mockAlertApi = {
  post: jest.fn(),
};

const mockOpaBackendApi = {
  getPolicyFromRepo: jest
    .fn()
    .mockResolvedValue({ opaPolicyContent: 'policy' }),
};

describe('OpaPolicyPage', () => {
  it('renders without crashing', async () => {
    mockOpaBackendApi.getPolicyFromRepo.mockResolvedValueOnce({
      opaPolicyContent: 'policy',
    });
    await act(async () => {
      renderInTestApp(
        <TestApiProvider
          apis={[
            [opaApiRef, mockOpaBackendApi],
            [alertApiRef, mockAlertApi],
          ]}
        >
          <OpaPolicyPage />
        </TestApiProvider>,
      );
    });

    expect(await screen.findByText('policy')).toBeInTheDocument();
  });
});
