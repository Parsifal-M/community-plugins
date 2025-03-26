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
import Fab from '@mui/material/Fab';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';

type StatusType = 'error' | 'warning' | 'info';

export const StatusChip = ({
  count,
  type,
}: {
  count: number;
  type: StatusType;
}) => {
  if (count <= 0) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <ErrorIcon sx={{ mr: 1 }} />;
      case 'warning':
        return <WarningIcon sx={{ mr: 1 }} />;
      case 'info':
        return <InfoIcon sx={{ mr: 1 }} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'error':
        return count === 1 ? '1 Error' : `${count} Errors`;
      case 'warning':
        return count === 1 ? '1 Warning' : `${count} Warnings`;
      case 'info':
        return count === 1 ? '1 Info' : `${count} Infos`;
      default:
        return null;
    }
  };

  return (
    <Fab variant="extended" size="small" color={type}>
      {getIcon()}
      {getLabel()}
    </Fab>
  );
};
