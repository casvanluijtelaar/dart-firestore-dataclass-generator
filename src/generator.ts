import { Field, baseTypes } from './utils';

export class Generator {
    fields: Field[];
    className: string;

    constructor(fields: Field[], className: string) {
        this.fields = fields;
        this.className = className;
    }

    getImports() {
        let imports: string = '';
        imports += `import 'package:cloud_firestore/cloud_firestore.dart';\n`;
        return imports += '\n';
    }

    getHeader() {
        return `class ${this.className} { \n\n`;
    }

    getFields() {
        let fields = '';
        for (let field of this.fields) {
            fields += `final ${field.type} ${field.name};\n`;
        }
        fields += 'final DocumentSnapshot snapshot;\n';
        fields += 'final DocumentReference reference;\n';
        fields += 'final String documentID;\n';
        fields += '\n\n';
        return fields;
    }

    getConstuctor() {
        let constructor = `${this.className}({\n`;
        for (let field of this.fields) {
            
            constructor += `this.${field.name},\n`;
        }
        constructor += 'this.snapshot,\n';
        constructor += 'this.reference,\n';
        constructor += 'this.documentID,\n';
        constructor += `});\n\n`;
        return constructor;
    }


    getFromFirestore() {
        let from = `factory ${this.className}.fromFirestore(DocumentSnapshot snapshot) { \n`;
        from += 'if(snapshot == null) return null;\n';
        from += 'var map = snapshot.data();\n\n';
        from += `return ${this.className}(\n`;

        for (let field of this.fields) {
            let entry = `${field.name}: `;
            // handle datetime object
            if (field.type === 'DateTime') entry += `map['${field.name}']?.toDate()`;
            // if it's a 'base' type, directly return map object
            else if (baseTypes.includes(field.type)) entry += `map['${field.name}']`;
            // if it's a list or map with a generic, cast the map object
            else if (field.type.includes('List') || field.type.includes('Map')) entry += `map['${field.name}'] != null ? ${field.type}.from(map['${field.name}']) : null`;
            // if it's any other (custom) object, look for a fromMap method on that object
            else entry += `map['${field.name}'] != null ? ${field.type}.fromMap(map['${field.name}']) : null`;

            from += `${entry},\n`;
        }
        from += 'snapshot: snapshot,\n';
        from += 'reference: snapshot.reference,\n';
        from += 'documentID: snapshot.id,\n';
        from += '); \n }\n\n';
        return from;
    }

    getFromMap() {
        let from = `factory ${this.className}.fromMap(Map<String, dynamic> map) {\n`;
        from += 'if(map == null) return null;\n\n';
        from += `return ${this.className}(\n`;
        for (let field of this.fields) {
            let entry = `${field.name}: `;
            if (field.type === 'DateTime') entry += `map['${field.name}']?.toDate()`;
            else if (baseTypes.includes(field.type)) entry += `map['${field.name}']`;
            else if (field.type.includes('List') || field.type.includes('Map')) entry += `map['${field.name}'] != null ? ${field.type}.from(map['${field.name}']) : null`;
            else entry += `map['${field.name}'] != null ? ${field.type}.fromMap(map['${field.name}']) : null`;

            from += `${entry},\n`;
        }
        from += '); \n }\n\n';
        return from;
    }

    getToMap() {
        let to = 'Map<String, dynamic> toMap() => {\n';
        for (let field of this.fields) {
            to += `'${field.name}': ${field.name},\n`;
        }
        to += '};\n\n';
        return to;

    }

    getCopyWidth() {
        let copy = `${this.className} copyWith({\n`;
        for (let field of this.fields) {
            copy += `${field.type} ${field.name}, `;
        }
        copy += '}) {\n';
        copy += `return ${this.className}(\n`;
        for (let field of this.fields) {
            copy += `${field.name}: ${field.name} ?? this.${field.name},\n`;
        }
        copy += ');\n';
        copy += '}\n\n';

        return copy;
    }

    getToString() {
        let toString = '@override\n';
        toString += 'String toString() {\n';
        toString += `return '`;
        for (let field of this.fields) {
            toString += '${' + `${field.name}.toString()` + '}, ';
        }
        toString += `';\n`;
        toString += '}\n\n';
        return toString;
    }

    getEqualsOperator() {
        let equals = '@override\n';
        equals += `bool operator ==(other) => other is ${this.className} && documentID == other.documentID;\n\n`;
        return equals;
    }

    getHashcode() {
        return 'int get hashCode => documentID.hashCode;';
    }

    getFooter() {
        return '}';
    }
}