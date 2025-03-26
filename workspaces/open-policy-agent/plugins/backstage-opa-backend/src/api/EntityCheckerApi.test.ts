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
  countResultByLevel,
  determineOverallStatus,
  EntityCheckerApiImpl,
  OPAResult,
} from './EntityCheckerApi';
import { mockServices } from '@backstage/backend-test-utils';

describe('EntityCheckerApiImpl', () => {
  it('should error if OPA package is not set', async () => {
    const mockLogger = mockServices.logger.mock();
    const config = mockServices.rootConfig({
      data: {
        opaClient: {
          baseUrl: 'http://localhost:8181',
        },
      },
    });

    const error = () => {
      /* eslint-disable no-new */
      new EntityCheckerApiImpl({
        logger: mockLogger,
        opaBaseUrl: config.getOptionalString('opaClient.baseUrl'),
        entityCheckerEntrypoint: config.getOptionalString(
          'opaClient.policies.entityChecker.entrypoint',
        ),
      });
    };

    expect(error).toThrow('OPA package not set or missing!');
  });

  it('should error url if OPA not set', async () => {
    const mockLogger = mockServices.logger.mock();
    const config = mockServices.rootConfig({
      data: {
        opaClient: {
          policies: {
            entityChecker: {
              entrypoint: 'entityCheckerEntrypoint',
            },
          },
        },
      },
    });

    const error = () => {
      /* eslint-disable no-new */
      new EntityCheckerApiImpl({
        logger: mockLogger,
        opaBaseUrl: config.getOptionalString('opaClient.baseUrl'),
        entityCheckerEntrypoint: config.getOptionalString(
          'opaClient.policies.entityChecker.entrypoint',
        ),
      });
    };

    expect(error).toThrow('OPA URL not set or missing!');
  });
});

describe('countResultByLevel', () => {
  it('should count the occurrences of each level', () => {
    const results: OPAResult[] = [
      { level: 'error', message: 'Error message 1' },
      { level: 'warning', message: 'Warning message 1' },
      { level: 'error', message: 'Error message 2' },
      { level: 'info', message: 'Info message 1' },
      { level: 'warning', message: 'Warning message 2' },
      { level: 'error', message: 'Error message 3' },
    ];

    const expectedCounts = new Map<string, number>([
      ['error', 3],
      ['warning', 2],
      ['info', 1],
    ]);

    const actualCounts = countResultByLevel(results);

    expect(actualCounts).toEqual(expectedCounts);
  });

  it('should return an empty map for an empty array', () => {
    const results: OPAResult[] = [];
    const expectedCounts = new Map<string, number>();
    const actualCounts = countResultByLevel(results);
    expect(actualCounts).toEqual(expectedCounts);
  });
});

describe('determineOverallStatus', () => {
  it('should return error if count of errors > 0', () => {
    const levelCounts = new Map([
      ['error', 2],
      ['warning', 1],
      ['info', 3],
    ]);
    const priorityOrder = ['error', 'warning', 'info'];
    expect(determineOverallStatus(levelCounts, priorityOrder)).toBe('error');
  });

  it('should return "warning" when there are no errors', () => {
    const levelCounts = new Map([
      ['warning', 1],
      ['info', 3],
    ]);
    const priorityOrder = ['error', 'warning', 'info'];
    expect(determineOverallStatus(levelCounts, priorityOrder)).toBe('warning');
  });

  it('should return "info" when there are no errors nor warnings', () => {
    const levelCounts = new Map([['info', 3]]);
    const priorityOrder = ['error', 'warning', 'info'];
    expect(determineOverallStatus(levelCounts, priorityOrder)).toBe('info');
  });

  it('should return "info" when all counts are 0', () => {
    const levelCounts = new Map([
      ['error', 0],
      ['warning', 0],
      ['info', 0],
    ]);
    const priorityOrder = ['error', 'warning', 'info'];
    expect(determineOverallStatus(levelCounts, priorityOrder)).toBe('pass');
  });

  it('should return "pass" when the map is empty', () => {
    const levelCounts = new Map();
    const priorityOrder = ['error', 'warning', 'info'];
    expect(determineOverallStatus(levelCounts, priorityOrder)).toBe('pass');
  });

  it('should use the provided priority order, let swap things around', () => {
    const levelCounts = new Map([
      ['error', 1],
      ['warning', 1],
      ['info', 1],
    ]);
    const priorityOrder = ['warning', 'error', 'info']; // Different order
    expect(determineOverallStatus(levelCounts, priorityOrder)).toBe('warning');
  });
});
