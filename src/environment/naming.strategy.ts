import { DefaultNamingStrategy, Table } from 'typeorm';
import { RandomGenerator } from 'typeorm/util/RandomGenerator';
import { camelCase } from 'lodash';

export class NamingStategy extends DefaultNamingStrategy {
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return super.joinColumnName(referencedColumnName, relationName);
  }

  foreignKeyName(tableOrName: Table | string, columnNames: string[], referencedTablePath: string): string {
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const replacedTableName = tableName.replace('.', '_');
    const replacedReferenceTablePath = referencedTablePath.replace('.', '_');
    const key = `${replacedTableName}_${replacedReferenceTablePath}_${clonedColumnNames.join('_')}`;
    return 'FK_' + RandomGenerator.sha1(key).substr(0, 27);
  }

  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    targetName = targetName.replace(/Entity$/, '');
    return super.tableName(targetName, userSpecifiedName);
  }

  joinTableName(firstTableName: string, secondTableName: string): string {
    return `${firstTableName}_${secondTableName}`;
  }

  joinTableColumnName(tableName: string, propertyName: string): string {
    return camelCase(`${propertyName}_${tableName}`);
  }

  joinTableInverseColumnName(tableName: string, propertyName: string): string {
    return camelCase(`${propertyName}_${tableName}`);
  }
}
