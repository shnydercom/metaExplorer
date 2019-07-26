#Documentation for the appinterpreter-editor
This editor component is used to visually represent and edit the part of an application which the developer decided to make declarative using Linked-Data-Blueprints.

The interpreters that are decorated with ldBlueprint will be shown in a tray on the left and can be dragged into the editor space. This can be a visual component but also any other class with that decorator, it must implement IBlueprintInterpreter however.

#Node types
InterpreterNodeModel is the base class, BaseDataTypeNodeModel, GeneralDataTypeNodeModel and DeclarationPartNodeModel inherit from it. The ports are defined as LDPortModels.
- BaseDataTypeNodeModel is used for basic LD-Datatypes from schema.org, they differ slightly from javascript-datatypes. See the enum *LDBaseDataType* for a list of implemented base data types. The node is also used to wrap UI-input-controls, so that these data types can be flattened into simple data types when serializing to json (basically to avoid conflicts)
- GeneralDataTypeNodeModel is used for any other previously defined interpreter
- DeclarationPartNodeModel is used to express something about the model that's being designed. When designing a new LD-Blueprint, it needs to be declared which interpreter should serve as the final output and which values are open for input on the new declaration (while others might just be empty because you're not using them).