import { DeclarationBlock } from '@graphql-codegen/visitor-plugin-common';
import { NAME_SELF, SUBITPTOF, CRUD_SKILLS, BLUEPRINT_CFG } from './constants';

export class MetaExplorerDeclarationBlock extends DeclarationBlock {

	public get string(): string {
		let result = '';
		let nameSelf = '';
		let subItptOf = `${SUBITPTOF} = null,`;
		let crudSkills = `${CRUD_SKILLS} = "cRUd",`;

		if (this._decorator) {
			result += this._decorator + '\n';
		}

		if (this._export) {
			result += 'export ';
		}
		console.dir(this)
		if (this._kind) {
			let extra = '';
			let name = '';

			if (['type', 'const', 'var', 'let'].includes(this._kind)) {
				extra = '= ';
			}

			if (this._name) {
				name = this._name + (this._nameGenerics || '') ;
				nameSelf = `${NAME_SELF} = "${name.trim()}",`;
			}

			result += this._kind + ' ' + name + ':' + BLUEPRINT_CFG + ' ' + extra;
		}

		if (this._block) {
			if (this._content) {
				result += this._content;
			}

			const blockWrapper = this._ignoreBlockWrapper ? '' : this._config.blockWrapper;
			const before = '{' + blockWrapper;
			const after = blockWrapper + '}';
			const block = [before, subItptOf, nameSelf, crudSkills, this._block, after].filter(val => !!val).join('\n');

			if (this._methodName) {
				result += `${this._methodName}(${this._config.blockTransformer(block)})`;
			} else {
				result += this._config.blockTransformer(block);
			}
		} else if (this._content) {
			result += this._content;
		} else if (this._kind) {
			result += '{}';
		}

		return (this._comment ? this._comment : '') + result + (this._kind === 'interface' || this._kind === 'enum' || this._kind === 'namespace' ? '' : ';') + '\n';
	}

}
