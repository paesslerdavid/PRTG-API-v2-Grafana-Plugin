import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms, InlineField, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { PRTGDataSource } from '../datasource';
import { PRTGDataSourceOptions, PRTGQuery } from '../types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<PRTGDataSource, PRTGQuery, PRTGDataSourceOptions>;

const ENDPOINT_OPTIONS: Array<SelectableValue<string>> = [
  { label: 'Objects (Experimental)', value: 'experimental/objects' },
  { label: 'Sensors', value: 'sensors' },
  { label: 'Devices', value: 'devices' },
  { label: 'Groups', value: 'groups' },
  { label: 'Probes', value: 'probes' },
];

const PREDEFINED_FILTERS: Array<SelectableValue<string>> = [
  { label: 'All Objects', value: '' },
  { label: 'Down Status', value: 'status = down' },
  { label: 'Warning Status', value: 'status = warning' },
  { label: 'Paused Status', value: 'status = paused' },
  { label: 'Up Status', value: 'status = up' },
  { label: 'Custom Filter', value: 'custom' },
];

const COMMON_COLUMNS = [
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
];

export class QueryEditor extends PureComponent<Props> {
  onEndpointChange = (value: SelectableValue<string>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, endpoint: value.value });
  };

  onFilterChange = (value: SelectableValue<string>) => {
    const { onChange, query } = this.props;
    if (value.value === 'custom') {
      onChange({ ...query, filter: '' });
    } else {
      onChange({ ...query, filter: value.value });
    }
  };

  onCustomFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, filter: event.target.value });
  };

  onLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    const limit = parseInt(event.target.value, 10);
    onChange({ ...query, limit: isNaN(limit) ? undefined : limit });
  };

  onOffsetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    const offset = parseInt(event.target.value, 10);
    onChange({ ...query, offset: isNaN(offset) ? undefined : offset });
  };

  onColumnsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    const columnsString = event.target.value;
    const columns = columnsString
      .split(',')
      .map(col => col.trim())
      .filter(col => col.length > 0);
    onChange({ ...query, columns: columns.length > 0 ? columns : undefined });
  };

  render() {
    const query = { ...this.props.query };
    const { endpoint, filter, limit, offset, columns } = query;

    const selectedEndpoint = ENDPOINT_OPTIONS.find(option => option.value === endpoint) || ENDPOINT_OPTIONS[0];
    
    const isCustomFilter = filter && !PREDEFINED_FILTERS.find(option => option.value === filter);
    const selectedFilter = isCustomFilter 
      ? PREDEFINED_FILTERS.find(option => option.value === 'custom')
      : PREDEFINED_FILTERS.find(option => option.value === filter) || PREDEFINED_FILTERS[0];

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <InlineField label="Endpoint" labelWidth={12}>
            <Select
              options={ENDPOINT_OPTIONS}
              value={selectedEndpoint}
              onChange={this.onEndpointChange}
              width={30}
            />
          </InlineField>
        </div>

        <div className="gf-form">
          <InlineField label="Filter" labelWidth={12}>
            <Select
              options={PREDEFINED_FILTERS}
              value={selectedFilter}
              onChange={this.onFilterChange}
              width={30}
            />
          </InlineField>
        </div>

        {(isCustomFilter || selectedFilter?.value === 'custom') && (
          <div className="gf-form">
            <FormField
              label="Custom Filter"
              labelWidth={12}
              inputWidth={30}
              onChange={this.onCustomFilterChange}
              value={filter || ''}
              placeholder="e.g., status = down AND name contains 'server'"
              tooltip="Use PRTG API v2 filter syntax"
            />
          </div>
        )}

        <div className="gf-form">
          <FormField
            label="Limit"
            labelWidth={12}
            inputWidth={15}
            onChange={this.onLimitChange}
            value={limit?.toString() || ''}
            placeholder="0 (no limit)"
            tooltip="Maximum number of results to return"
            type="number"
          />
        </div>

        <div className="gf-form">
          <FormField
            label="Offset"
            labelWidth={12}
            inputWidth={15}
            onChange={this.onOffsetChange}
            value={offset?.toString() || ''}
            placeholder="0"
            tooltip="Number of results to skip"
            type="number"
          />
        </div>

        <div className="gf-form">
          <FormField
            label="Columns"
            labelWidth={12}
            inputWidth={30}
            onChange={this.onColumnsChange}
            value={columns?.join(', ') || ''}
            placeholder="name, status, message, parent.name"
            tooltip={`Comma-separated list of columns to display. Common columns: ${COMMON_COLUMNS.join(', ')}`}
          />
        </div>

        <div className="gf-form-group">
          <div className="gf-form">
            <div className="gf-form-label width-12">Help</div>
            <div className="gf-form-label">
              <small>
                Use the PRTG API v2 syntax for filters. 
                Examples: &quot;status = down&quot;, &quot;name contains &apos;server&apos;&quot;, &quot;status = warning AND device = &apos;router&apos;&quot;
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
