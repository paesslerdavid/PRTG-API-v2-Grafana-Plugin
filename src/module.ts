import { DataSourcePlugin } from '@grafana/data';
import { PRTGDataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { PRTGQuery, PRTGDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<PRTGDataSource, PRTGQuery, PRTGDataSourceOptions>(PRTGDataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
