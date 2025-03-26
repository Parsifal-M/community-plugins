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
import React, { useState, useEffect } from 'react';
import {
  Content,
  InfoCard,
  Progress,
  CopyTextButton,
} from '@backstage/core-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { OpaPolicy } from '../../api/types';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { a11yDark, coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@material-ui/core';
import { opaApiRef } from '../../api';

export const OpaPolicyPage = () => {
  const theme = useTheme();
  const [policy, setPolicy] = useState<OpaPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const opaApi = useApi(opaApiRef);
  const { entity } = useEntity();
  const alertApi = useApi(alertApiRef);
  const opaPolicy = entity.metadata?.annotations?.['open-policy-agent/policy'];

  useEffect(() => {
    const fetchData = async () => {
      if (opaPolicy) {
        try {
          const response = await opaApi.getPolicyFromRepo(opaPolicy);
          if (response.opaPolicyContent) {
            setPolicy(response);
            setLoading(false);
          }
        } catch (error: unknown) {
          alertApi.post({
            message: `Could not fetch OPA policy: ${error}`,
            severity: 'error',
            display: 'transient',
          });
        }
      }
    };
    fetchData();
  }, [opaApi, entity, opaPolicy, alertApi]);

  if (loading) {
    return <Progress data-testid="progress" />;
  }

  return (
    <Content>
      <InfoCard
        title={`${entity.metadata.name} OPA Policy`}
        data-testid="opa-policy-card"
        action={
          <CopyTextButton
            text={policy?.opaPolicyContent ?? ''}
            tooltipText="Copied policy to clipboard!"
          />
        }
      >
        <SyntaxHighlighter
          language="rego"
          style={theme.palette.type === 'dark' ? a11yDark : coy}
          customStyle={{ background: 'inherit', fontSize: '110%' }}
          showLineNumbers
        >
          {policy?.opaPolicyContent ?? ''}
        </SyntaxHighlighter>
      </InfoCard>
    </Content>
  );
};
