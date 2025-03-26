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
export interface Config {
  /**
   * Configuration options for the OpaClient plugin
   */
  opaClient?: {
    /**
     * The base url of the OPA server used for all OPA plugins.
     * This is used across all the OPA plugins.
     */
    baseUrl?: string;

    /**
     * Configuration options for the OPA policies
     */
    policies?: {
      /**
       * Configuration options for the entity metadata checker policy
       */
      entityChecker?: {
        /**
         * The path to the entity metadata checker package in the OPA server
         */
        entrypoint?: string;
      };
      /**
       * Configuration options for the OPA Permissions Wrapper
       */
      permissions?: {
        /**
         * The entrypoint to the OPA Permissions Wrapper
         */
        entrypoint?: string;

        /**
         * The fallback policy to use when the OPA server is unavailable
         */
        policyFallback?: string;
      };
    };
  };
}
