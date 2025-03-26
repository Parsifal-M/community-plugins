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
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../ExampleFetchComponent';
import { RequireOpaAuthz } from '@backstage-community/backstage-plugin-opa-authz-react';

// We can set permissions based on the day of the week to display the table
const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const currentDate = new Date();
const dayOfWeek = daysOfWeek[currentDate.getDay()];

const opaInput = {
  day: dayOfWeek,
};

export const ExampleComponent = () => (
  <RequireOpaAuthz input={{ action: 'see-plugin' }} entryPoint="opa_demo">
    <Page themeId="tool">
      <RequireOpaAuthz input={{ action: 'see-header' }} entryPoint="opa_demo">
        <Header
          title="Welcome to opa-frontend-demo!"
          subtitle="Optional subtitle"
        >
          <HeaderLabel label="Owner" value="Team X" />
          <HeaderLabel label="Lifecycle" value="Alpha" />
        </Header>
      </RequireOpaAuthz>
      <Content>
        <ContentHeader title="OPA Frontend Demo">
          <RequireOpaAuthz
            input={{ action: 'see-support-button' }}
            entryPoint="opa_demo"
          >
            <SupportButton>Help!</SupportButton>
          </RequireOpaAuthz>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <RequireOpaAuthz
              input={{ action: 'see-info-card' }}
              entryPoint="opa_demo"
            >
              <InfoCard title="Information card">
                <Typography variant="body1">
                  This card is conditionally rendered based on the OPA policy!
                </Typography>
              </InfoCard>
            </RequireOpaAuthz>
          </Grid>
          {/* Table is rendered based on the day of the week! */}
          <RequireOpaAuthz input={opaInput} entryPoint="opa_demo">
            <Grid item>
              <ExampleFetchComponent />
            </Grid>
          </RequireOpaAuthz>
        </Grid>
      </Content>
    </Page>
  </RequireOpaAuthz>
);
