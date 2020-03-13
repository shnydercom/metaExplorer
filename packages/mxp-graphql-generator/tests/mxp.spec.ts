import { validateTs } from '@graphql-codegen/testing';
import { Types, mergeOutputs } from '@graphql-codegen/plugin-helpers';
import { buildSchema, parse, GraphQLSchema, GraphQLObjectType, GraphQLEnumType } from 'graphql';
import { plugin } from '../src/ts/index';

describe('MetaExplorer', () => {
  it('should expose Maybe', async () => {
    const schema = buildSchema(/* GraphQL */ `
      scalar A
    `);
    const aMap = schema.getTypeMap();
    const b = Object.keys(aMap).join('\n');
    const result = (await plugin(schema, [], {}, { outputFile: '' })) as Types.ComplexPluginOutput;
    expect(result.prepend).toBeSimilarStringTo('export type Maybe<T> =');
	});
});
