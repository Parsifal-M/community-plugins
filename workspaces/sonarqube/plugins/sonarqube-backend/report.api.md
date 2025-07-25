## API Report File for "@backstage-community/plugin-sonarqube-backend"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { BackendFeature } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';

// @public @deprecated (undocumented)
export function createRouter(options: RouterOptions): Promise<express.Router>;

// @public
export class DefaultSonarqubeInfoProvider implements SonarqubeInfoProvider {
  static fromConfig(
    config: Config,
    logger: LoggerService,
  ): DefaultSonarqubeInfoProvider;
  getBaseUrl(options?: { instanceName?: string }): {
    baseUrl: string;
    externalBaseUrl?: string;
  };
  getFindings(options: {
    componentKey: string;
    instanceName?: string;
  }): Promise<SonarqubeFindings | undefined>;
}

// @public @deprecated (undocumented)
export interface RouterOptions {
  logger: LoggerService;
  sonarqubeInfoProvider: SonarqubeInfoProvider;
}

// @public
export class SonarqubeConfig {
  constructor(instances: SonarqubeInstanceConfig[]);
  static fromConfig(config: Config): SonarqubeConfig;
  getInstanceConfig(options?: {
    sonarqubeName?: string;
  }): SonarqubeInstanceConfig;
  // (undocumented)
  readonly instances: SonarqubeInstanceConfig[];
}

// @public
export interface SonarqubeFindings {
  analysisDate: string;
  measures: SonarqubeMeasure[];
}

// @public
export interface SonarqubeInfoProvider {
  getBaseUrl(options?: { instanceName?: string }): {
    baseUrl: string;
    externalBaseUrl?: string;
  };
  getFindings(options: {
    componentKey: string;
    instanceName?: string;
  }): Promise<SonarqubeFindings | undefined>;
}

// @public
export interface SonarqubeInstanceConfig {
  apiKey: string;
  authType?: 'Bearer' | 'Basic';
  baseUrl: string;
  externalBaseUrl?: string;
  name: string;
}

// @public
export interface SonarqubeMeasure {
  metric: string;
  value: string;
}

// @public
const sonarqubePlugin: BackendFeature;
export default sonarqubePlugin;

// (No @packageDocumentation comment for this package)
```
