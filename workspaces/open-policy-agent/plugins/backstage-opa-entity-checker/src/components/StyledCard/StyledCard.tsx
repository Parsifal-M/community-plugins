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
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

const PREFIX = 'OpaMetadataAnalysisCard';

export const classes = {
  card: `${PREFIX}-card`,
  title: `${PREFIX}-title`,
  alert: `${PREFIX}-alert`,
  chip: `${PREFIX}-chip`,
  titleBox: `${PREFIX}-titleBox`,
};

export const StyledCard = styled(Card)(({ theme }) => ({
  [`& .${classes.card}`]: {
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.title}`]: {
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.chip}`]: {
    marginLeft: 'auto',
  },

  [`& .${classes.titleBox}`]: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));
