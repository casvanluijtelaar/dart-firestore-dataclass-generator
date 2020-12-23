# A Firestore data class generator for Dart. 

Automatically generate a dart data class directly from a Firebase Firestore document.

## Features :link:

Generate custom classes that support all the base firestore types, as well as custom types. 

create an empty dart file, add your variables and run the  `Dart: Generate Firestore data class` command using `ctrl+shift+P` or `F1`

![demo gif](./assets/demo.gif)


### what it generates:
- constructor that automatically adds important firestore methods 
- fromFirestore and fromMap factories
- toMap function that for uploading to firestore
- copyWith method
- overwrites ==, toString and hashcode methods



## Known Issues :heavy_exclamation_mark:

- No support yet for nested Lists and Maps

## Get involved! :raised_hands:

this was a weekend project and is in no way finished yet. If you find any bugs or want to contribute, let me know on [GitHub](https://github.com/casvanluijtelaar/dart-firestore-dataclass-generator)

