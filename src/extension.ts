import * as vscode from 'vscode';
import { getFileExtension, showError, getFields, writeToDocument } from './utils';
import { Generator } from './generator';

export function activate(context: vscode.ExtensionContext) {


	let disposable = vscode.commands.registerCommand('dart-firestore-dataclass-generator.generate', async () => {
		
		// get all the text in current file
		const fileText = vscode.window.activeTextEditor?.document?.getText();
		// get current file extension
		const extension = getFileExtension();
		// assure current file is a valid dart file
		if (fileText === undefined || extension !== 'dart') return showError(extension ?? 'no');
		// show popup to enter a classname
		let className = await vscode.window.showInputBox({ placeHolder: 'AwesomeClass', prompt: 'Enter a class name' });
		// assure a valid classname was entered
		if (className === undefined || className.trim() === '') return showError('No class name provided');
		// assure that first letter of classname is uppercase
		className = className.charAt(0).toUpperCase() + className.slice(1);
		// get a list of all the fields in 
		const fields = getFields(fileText);
		if(fields.length === 0) return showError('provide at least one field');

		// setup a new class generator
		const generator = new Generator(fields, className);
		let output: string = '';

		output += generator.getImports();
		output += generator.getHeader();
		output += generator.getFields();
		output += generator.getConstuctor();
		output += generator.getFromFirestore();
		output += generator.getFromMap();
		output += generator.getToMap();
		output += generator.getCopyWidth();
		output += generator.getToString();
		output += generator.getEqualsOperator();
		output += generator.getHashcode();
		output += generator.getFooter();
		
		// write and apply changes to dart file
		const result = writeToDocument(output);
		await vscode.workspace.applyEdit(result);
		// format document
		await vscode.commands.executeCommand("editor.action.format");
	});

	context.subscriptions.push(disposable);
}









