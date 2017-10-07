# problem messages:
	Argument of type 'typeof YourClass' is not assignable to parameter of type 'new (...args: any[]) => IBlueprintInterpreter'.
	Type 'YourClass' is not assignable to type 'IBlueprintInterpreter'.
	Property 'consumeWebResource' is missing in type 'YourClass'.
# fix:
	have the class implement the interface 'IBlueprintInterpreter'