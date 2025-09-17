import { MutableDataFrame, FieldType, Field } from '@grafana/data';
import { PRTGObject } from './types';

export function transformPRTGDataToDataFrame(
  data: PRTGObject[],
  refId: string,
  columns?: string[]
): MutableDataFrame {
  if (!data.length) {
    return new MutableDataFrame({
      refId,
      fields: [
        { name: 'No Data', type: FieldType.string }
      ],
    });
  }

  const fields = createFieldsFromPRTGData(data[0], columns);
  const frame = new MutableDataFrame({
    refId,
    fields,
  });

  // Add each row of data
  for (const item of data) {
    const row = transformPRTGObjectToRow(item, columns);
    frame.add(row);
  }

  return frame;
}

export function createFieldsFromPRTGData(
  sampleObject: PRTGObject,
  columns?: string[]
): Field[] {
  const fieldsToShow = columns || Object.keys(sampleObject);
  
  return fieldsToShow.map(fieldName => ({
    name: formatFieldName(fieldName),
    type: getFieldTypeFromValue(getValueFromPath(sampleObject, fieldName)),
  }));
}

export function transformPRTGObjectToRow(
  obj: PRTGObject,
  columns?: string[]
): Record<string, any> {
  const fieldsToShow = columns || Object.keys(obj);
  const row: Record<string, any> = {};

  for (const field of fieldsToShow) {
    const value = getValueFromPath(obj, field);
    row[formatFieldName(field)] = value;
  }

  return row;
}

export function getValueFromPath(obj: any, path: string): any {
  if (path.includes('.')) {
    const [parentKey, childKey] = path.split('.');
    const parentObj = obj[parentKey];
    return parentObj?.[childKey] || null;
  }
  return obj[path];
}

export function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/\./g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export function getFieldTypeFromValue(value: any): FieldType {
  if (value === null || value === undefined) {
    return FieldType.string;
  }

  if (typeof value === 'number') {
    return FieldType.number;
  }

  if (typeof value === 'boolean') {
    return FieldType.boolean;
  }

  // Check if it's a date string
  if (typeof value === 'string') {
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime()) && value.match(/\d{4}-\d{2}-\d{2}/)) {
      return FieldType.time;
    }
  }

  return FieldType.string;
}

export function getPredefinedColumns(): string[] {
  return [
    'name',
    'status',
    'message',
    'parent.name',
    'lastup',
    'lastdown',
    'kind_name',
    'objid',
    'device',
    'group',
    'probe',
    'host',
    'tags',
    'active',
    'position',
    'comments',
  ];
}

export function getColumnSuggestions(searchTerm: string): string[] {
  const allColumns = getPredefinedColumns();
  if (!searchTerm) {
    return allColumns;
  }

  return allColumns.filter(column =>
    column.toLowerCase().includes(searchTerm.toLowerCase())
  );
}