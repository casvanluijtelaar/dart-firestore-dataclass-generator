import * as vscode from 'vscode';

export class Field {
	type: string;
	name: string;

	constructor(type: string, name: string) {
		this.type = type;
		this.name = name;
	}
};

export const baseTypes: string[] = ['String', 'int', 'double', 'bool', 'DocumentReference', 'GeoPoint', 'List', 'Map', 'Timestamp'];

export const showError = (error: string) => vscode.window.showErrorMessage(error);

export const getFileExtension = (): string | undefined => {
	const name = vscode.window.activeTextEditor?.document?.fileName;
	if (name === undefined) return undefined;
	const parts = name.split('.');
	return parts[parts.length - 1];
};

export const getFields = (text: string): Field[] => {
	const lines: string[] = text.split('\n');
	const fields: Field[] = [];

	for (let line of lines) {
		const trimmed = line.trim().replace(';', '');
		if (trimmed === '') continue;

		const words = trimmed.split(' ');
		if (words[0] === 'import') continue;
		const name = words[words.length - 1];
		words.pop();
		const type = words.join(' ');
		fields.push(new Field(type, name));

	}
	return fields;
};

export const writeToDocument = (text: string): vscode.WorkspaceEdit => {
	const edit = new vscode.WorkspaceEdit();
	const uri = vscode.window.activeTextEditor?.document.uri;
	if (uri !== undefined) {
		edit.replace(
			uri,
			new vscode.Range(new vscode.Position(0, 0), new vscode.Position(text.split('\n').length, 0)),
			text,
		);
	}
	return edit;
};