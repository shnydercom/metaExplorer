import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { visit, concatAST, GraphQLSchema, Kind, FragmentDefinitionNode } from 'graphql';
import { MetaExplorerDocumentsVisitor } from './visitor';
import { LoadedFragment, optimizeOperations } from '@graphql-codegen/visitor-plugin-common';
import { MetaExplorerDocumentsPluginConfig } from './config';

export const plugin: PluginFunction<{}
//TypeScriptDocumentsPluginConfig
> = (schema: GraphQLSchema, rawDocuments: Types.DocumentFile[], config: MetaExplorerDocumentsPluginConfig) => {
  const documents = rawDocuments;
  const allAst = concatAST(documents.map((v) => v.document));

  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter((d) => d.kind === Kind.FRAGMENT_DEFINITION) as FragmentDefinitionNode[]).map((fragmentDef) => ({ node: fragmentDef, name: fragmentDef.name.value, onType: fragmentDef.typeCondition.name.value, isExternal: false })),
    ...(config.externalFragments || []),
  ];

  const visitorResult = visit(allAst, {
    leave: new MetaExplorerDocumentsVisitor(schema, config, allFragments),
  });

  const result = visitorResult.definitions.join('\n');

  return result;

};

//export { MetaExplorerDocumentsVisitor };
