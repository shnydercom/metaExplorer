import { BaseSelectionSetProcessor, ProcessResult, LinkField, PrimitiveAliasedFields, PrimitiveField, SelectionSetProcessorConfig } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLObjectType, GraphQLInterfaceType, isEnumType } from 'graphql';
import { getBaseType } from '@graphql-codegen/plugin-helpers';

/* tslint:disable */
export class MetaExplorerSelectionSetProcessor extends BaseSelectionSetProcessor<SelectionSetProcessorConfig> {
  transformPrimitiveFields(schemaType: GraphQLObjectType | GraphQLInterfaceType, fields: PrimitiveField[]): ProcessResult {
    /*if (fields.length === 0) {
      return [];
    }

    const parentName =
      (this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '') +
      this.config.convertName(schemaType.name, {
        useTypesPrefix: true,
      });

    return [`Pick<${parentName}, ${fields.map(field => `'${field}'`).join(' | ')}>`];*/
    if (fields.length === 0) {
      return [];
    }

    return fields.map(field => {
      const fieldObj = schemaType.getFields()[field];
      const baseType = getBaseType(fieldObj.type);
      let typeToUse = baseType.name;

      if (isEnumType(baseType)) {
        typeToUse = (this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '') + this.config.convertName(baseType.name, { useTypesPrefix: this.config.enumPrefix });
      } else if (this.config.scalars[baseType.name]) {
        typeToUse = this.config.scalars[baseType.name];
      }

      const wrappedType = this.config.wrapTypeWithModifiers(typeToUse, fieldObj.type as GraphQLObjectType);

      return {
        name: this.config.formatNamedField(field),
        type: wrappedType,
      };
    });
  }

  transformTypenameField(type: string, name: string): ProcessResult {
    return [`{ ${name}: ${type} }`];
	}

  transformAliasesPrimitiveFields(schemaType: GraphQLObjectType | GraphQLInterfaceType, fields: PrimitiveAliasedFields[]): ProcessResult {
    if (fields.length === 0) {
      return [];
    }

    const parentName =
      (this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '') +
      this.config.convertName(schemaType.name, {
        useTypesPrefix: true,
      });

    return [
      `{ ${fields
        .map(aliasedField => {
          const value = aliasedField.fieldName === '__typename' ? `'${schemaType.name}'` : `${parentName}['${aliasedField.fieldName}']`;

          return `${this.config.formatNamedField(aliasedField.alias)}: ${value}`;
        })
        .join(', ')} }`,
    ];
  }

  transformLinkFields(fields: LinkField[]): ProcessResult {
    if (fields.length === 0) {
      return [];
    }

    return [`{ ${fields.map(field => `${this.config.formatNamedField(field.alias || field.name)}: ${field.selectionSet}`).join(', ')} }`];
  }
}
