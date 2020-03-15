import { ParsedEnumValuesMap, OperationVariablesToObject, NormalizedScalarsMap, ConvertNameFn, InterfaceOrVariable, getBaseTypeNode } from '@graphql-codegen/visitor-plugin-common';
import { TypeNode, Kind } from 'graphql';
import { ikvFragment } from './constants';

/* tslint:disable */
export class MetaExplorerOperationVariablesToObject extends OperationVariablesToObject {
	constructor(
		_scalars: NormalizedScalarsMap,
		_convertName: ConvertNameFn,
		private _avoidOptionals: boolean,
		private _immutableTypes: boolean,
		_namespacedImportName: string | null = null,
		_enumNames: string[] = [],
		_enumPrefix = true,
		_enumValues: ParsedEnumValuesMap = {}
	) {
		super(_scalars, _convertName, _namespacedImportName, _enumNames, _enumPrefix, _enumValues);
	}

	private clearOptional(str: string): string {
		console.log(str)
		const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';
		const rgx = new RegExp(`^${prefix}Maybe<(.*?)>$`, 'i');

		if (str.startsWith(`${this._namespacedImportName ? `${this._namespacedImportName}.` : ''}Maybe`)) {
			return str.replace(rgx, '$1');
		}

		return str;
	}

	public wrapAstTypeWithModifiers(baseType: string, typeNode: TypeNode): string {
		const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';

		if (typeNode.kind === Kind.NON_NULL_TYPE) {
			const type = this.wrapAstTypeWithModifiers(baseType, typeNode.type);

			return this.clearOptional(type);
		} else if (typeNode.kind === Kind.LIST_TYPE) {
			const innerType = this.wrapAstTypeWithModifiers(baseType, typeNode.type);

			return `${prefix}Maybe<${this._immutableTypes ? 'ReadonlyArray' : 'Array'}<${innerType}>>`;
		} else {
			return `${prefix}Maybe<${baseType}>`;
		}
	}

	protected transformVariable<TDefinitionType extends InterfaceOrVariable>(variable: TDefinitionType): string {
    let typeValue = null;
    const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';

    if (typeof variable.type === 'string') {
      typeValue = variable.type;
    } else {
      const baseType = getBaseTypeNode(variable.type);
      const typeName = baseType.name.value;

      if (this._scalars[typeName]) {
        typeValue = this.getScalar(typeName);
      } else if (this._enumValues[typeName] && this._enumValues[typeName].sourceFile) {
        typeValue = this._enumValues[typeName].typeIdentifier || this._enumValues[typeName].sourceIdentifier;
      } else {
        typeValue = `${prefix}${this._convertName(baseType, {
          useTypesPrefix: this._enumNames.includes(typeName) ? this._enumPrefix : true,
        })}`;
      }
    }

    const fieldName = this.getName(variable);
    const fieldType = this.wrapAstTypeWithModifiers(typeValue, variable.type);

    const hasDefaultValue = variable.defaultValue != null && typeof variable.defaultValue !== 'undefined';
    const isNonNullType = variable.type.kind === Kind.NON_NULL_TYPE;

    const formattedFieldString = this.formatFieldString(fieldName, isNonNullType, hasDefaultValue);
    const formattedTypeString = this.formatTypeString(fieldType, isNonNullType, hasDefaultValue);

		const rv = ikvFragment(formattedFieldString, null, formattedTypeString);

    return rv;
  }

	protected formatFieldString(fieldName: string, isNonNullType: boolean, hasDefaultValue: boolean): string {
		if (!hasDefaultValue && (this._avoidOptionals || isNonNullType)) {
			return fieldName;
		}
		return `${fieldName}?`;
	}

	protected formatTypeString(fieldType: string, isNonNullType: boolean, hasDefaultValue: boolean): string {
		if (!hasDefaultValue && isNonNullType) {
			return this.clearOptional(fieldType);
		}

		return fieldType;
	}

	protected getPunctuation(): string {
		return ';';
	}
}
