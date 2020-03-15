import { TypeScriptOperationVariablesToObject as TSOperationVariablesToObject } from '../ts';

export class TypeScriptOperationVariablesToObject extends TSOperationVariablesToObject {
  protected formatTypeString(fieldType: string, isNonNullType: boolean, hasDefaultValue: boolean): string {
    return fieldType;
  }
}
