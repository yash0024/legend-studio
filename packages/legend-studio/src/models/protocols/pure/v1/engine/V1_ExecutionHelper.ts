/**
 * Copyright (c) 2020-present, Goldman Sachs
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
  guaranteeNonNullable,
  UnsupportedOperationError,
} from '@finos/legend-studio-shared';
import {
  TdsRow,
  INTERNAL__UnknownExecutionResult,
  ClassExecutionResult,
  JsonExecutionResult,
  RelationalExecutionActivity,
  TdsExecutionResult,
  TdsBuilder,
  TDSColumn,
} from '../../../../metamodels/pure/action/execution/ExecutionResult';
import type { ExecutionResult } from '../../../../metamodels/pure/action/execution/ExecutionResult';
import type {
  V1_ExecutionResult,
  V1_RelationalExecutionActivity,
  V1_TdsBuilder,
} from './execution/V1_ExecutionResult';
import {
  V1_ClassExecutionResult,
  V1_JsonExecutionResult,
  V1_INTERNAL__UnknownExecutionResult,
  V1_TdsExecutionResult,
} from './execution/V1_ExecutionResult';

const buildJSONExecutionResult = (
  protocol: V1_JsonExecutionResult,
): JsonExecutionResult => {
  const metamodel = new JsonExecutionResult();
  metamodel.values = guaranteeNonNullable(
    protocol.values,
    `JSON execution result value is missing`,
  );
  return metamodel;
};

const buildTDSBuilder = (protocol: V1_TdsBuilder): TdsBuilder => {
  const builder = new TdsBuilder();
  builder.columns = protocol.columns.map((_column) => {
    const column = new TDSColumn();
    column.name = guaranteeNonNullable(
      _column.name,
      `TDS column name is missing`,
    );
    column.type = _column.type;
    column.doc = _column.doc;
    column.relationalType = _column.relationalType;
    return column;
  });
  return builder;
};

const buildRelationalExecutionActivity = (
  protocol: V1_RelationalExecutionActivity,
): RelationalExecutionActivity => {
  const metamodel = new RelationalExecutionActivity();
  metamodel.sql = guaranteeNonNullable(
    protocol.sql,
    `Relational execution activity SQL is missing`,
  );
  return metamodel;
};

const buildTDSExecutionResult = (
  protocol: V1_TdsExecutionResult,
): TdsExecutionResult => {
  const metamodel = new TdsExecutionResult();
  metamodel.values = guaranteeNonNullable(
    protocol.result,
    `TDS execution result value is missing`,
  );
  metamodel.builder = buildTDSBuilder(
    guaranteeNonNullable(
      protocol.builder,
      `TDS execution result builder is missing`,
    ),
  );
  metamodel.activities = protocol.activities.map(
    buildRelationalExecutionActivity,
  );
  metamodel.result.columns = (
    protocol.result as {
      columns: string[];
    }
  ).columns;
  metamodel.result.rows = (
    protocol.result as {
      rows: { values: (string | number)[] }[];
    }
  ).rows.map((_row) => {
    const row = new TdsRow();
    row.values = _row.values;
    return row;
  });
  return metamodel;
};

const buildClassExecutionResult = (
  protocol: V1_ClassExecutionResult,
): ClassExecutionResult => {
  const metamodel = new ClassExecutionResult();
  metamodel.values = guaranteeNonNullable(
    protocol.objects,
    `Class execution result value is missing`,
  );
  metamodel.activities = protocol.activities.map(
    buildRelationalExecutionActivity,
  );
  return metamodel;
};

export const V1_buildExecutionResult = (
  protocol: V1_ExecutionResult,
): ExecutionResult => {
  if (protocol instanceof V1_ClassExecutionResult) {
    return buildClassExecutionResult(protocol);
  } else if (protocol instanceof V1_TdsExecutionResult) {
    return buildTDSExecutionResult(protocol);
  } else if (protocol instanceof V1_JsonExecutionResult) {
    return buildJSONExecutionResult(protocol);
  } else if (protocol instanceof V1_INTERNAL__UnknownExecutionResult) {
    return new INTERNAL__UnknownExecutionResult(protocol.content);
  }
  throw new UnsupportedOperationError(`Can't build execution result`, protocol);
};