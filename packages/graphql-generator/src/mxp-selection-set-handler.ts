import { SelectionSetToObject, getFieldNodeNameValue, mergeSelectionSets, LinkField, ProcessResult, NameAndType } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLObjectType, SelectionNode, FieldNode, GraphQLOutputType, GraphQLField, SchemaMetaFieldDef, TypeMetaFieldDef, SelectionSetNode, GraphQLNamedType } from 'graphql';
import { getBaseType } from '@graphql-codegen/plugin-helpers';
import { ikvFragment } from './constants';
import { LDDict } from '@metaexplorer/core';

function isMetadataFieldName(name: string) {
  return ['__schema', '__type'].includes(name);
}

const metadataFieldMap: Record<string, GraphQLField<any, any>> = {
  __schema: SchemaMetaFieldDef,
  __type: TypeMetaFieldDef,
};

export class MetaExplorerSelectionSetToObject extends SelectionSetToObject {
	public createNext(parentSchemaType: GraphQLNamedType, selectionSet: SelectionSetNode): SelectionSetToObject {
    return new MetaExplorerSelectionSetToObject(
      this._processor,
      this._scalars,
      this._schema,
      this._convertName.bind(this),
      this._loadedFragments,
      this._config,
      parentSchemaType,
      selectionSet
    );
  }
	protected buildSelectionSetString(
		parentSchemaType: GraphQLObjectType,
		selectionNodes: Array<SelectionNode | string>
	) {
		const primitiveFields = new Map<string, FieldNode>();
		const primitiveAliasFields = new Map<string, FieldNode>();
		const linkFieldSelectionSets = new Map<
			string,
			{
				selectedFieldType: GraphQLOutputType;
				field: FieldNode;
			}
		>();
		let requireTypename = false;
		const fragmentsSpreadUsages: string[] = [];

		for (const selectionNode of selectionNodes) {
			if (typeof selectionNode === 'string') {
				fragmentsSpreadUsages.push(selectionNode);
			} else if (selectionNode.kind === 'Field') {
				if (!selectionNode.selectionSet) {
					if (selectionNode.alias) {
						primitiveAliasFields.set(selectionNode.alias.value, selectionNode);
					} else if (selectionNode.name.value === '__typename') {
						requireTypename = true;
					} else {
						primitiveFields.set(selectionNode.name.value, selectionNode);
					}
				} else {
					let selectedField: GraphQLField<any, any, any> = null;

					const fields = parentSchemaType.getFields();
					selectedField = fields[selectionNode.name.value];

					if (isMetadataFieldName(selectionNode.name.value)) {
						selectedField = metadataFieldMap[selectionNode.name.value];
					}

					if (!selectedField) {
						continue;
					}

					const fieldName = getFieldNodeNameValue(selectionNode);
					let linkFieldNode = linkFieldSelectionSets.get(fieldName);
					if (!linkFieldNode) {
						linkFieldNode = {
							selectedFieldType: selectedField.type,
							field: selectionNode,
						};
						linkFieldSelectionSets.set(fieldName, linkFieldNode);
					} else {
						mergeSelectionSets(linkFieldNode.field.selectionSet, selectionNode.selectionSet);
					}
				}
			}
		}

		const linkFields: LinkField[] = [];
		for (const { field, selectedFieldType } of linkFieldSelectionSets.values()) {
			const realSelectedFieldType = getBaseType(selectedFieldType as any);
			const selectionSet = this.createNext(realSelectedFieldType, field.selectionSet);

			linkFields.push({
				alias: field.alias ? this._processor.config.formatNamedField(field.alias.value, selectedFieldType) : undefined,
				name: this._processor.config.formatNamedField(field.name.value, selectedFieldType),
				type: realSelectedFieldType.name,
				selectionSet: this._processor.config.wrapTypeWithModifiers(
					selectionSet.transformSelectionSet().split(`\n`).join(`\n  `),
					selectedFieldType
				),
			});
		}

		const typeInfoField = this.buildTypeNameField(
			parentSchemaType,
			this._config.nonOptionalTypename,
			this._config.addTypename,
			requireTypename
		);
		const transformed: ProcessResult = [
			...(typeInfoField ? this._processor.transformTypenameField(typeInfoField.type, typeInfoField.name) : []),
			...this._processor.transformPrimitiveFields(
				parentSchemaType,
				Array.from(primitiveFields.values()).map((field) => field.name.value)
			),
			...this._processor.transformAliasesPrimitiveFields(
				parentSchemaType,
				Array.from(primitiveAliasFields.values()).map((field) => ({
					alias: field.alias.value,
					fieldName: field.name.value,
				}))
			),
			...this._processor.transformLinkFields(linkFields),
		].filter(Boolean);

		const allStrings: string[] = transformed.filter((t) => typeof t === 'string') as string[];
		const allObjectsMerged: string[] = transformed
			.filter((t) => typeof t !== 'string')
			.map((t: NameAndType) => {
				let rType = t.type;
				if (rType === 'string') rType = LDDict.Text;
				return ikvFragment(t.name, null, `"${rType}"`);
			}
			);
		let mergedObjectsAsString: string = null;

		if (allObjectsMerged.length > 0) {
			mergedObjectsAsString = this._processor.buildFieldsIntoObject(allObjectsMerged);
		}

		const fields = [...allStrings, mergedObjectsAsString, ...fragmentsSpreadUsages].filter(Boolean);

		return this._processor.buildSelectionSetFromStrings(fields);
	}

}
