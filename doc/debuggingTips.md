# problem messages:
	Argument of type 'typeof YourClass' is not assignable to parameter of type 'new (...args: any[]) => IBlueprintItpt'.
	Type 'YourClass' is not assignable to type 'IBlueprintItpt'.
	Property 'consumeWebResource' is missing in type 'YourClass'.
# fix:
	have the class implement the interface 'IBlueprintItpt'
	
# problem message:
	many errors, mostly in some TSX that was previously working fine. A way up the log you'll find that errors come from multiple definitions of react-types inside submodules. E.g. "node-modules/react-redux/node-modules/@types/react".
# fix:
	delete the @types-directory in any subfolder where the error pops up


# problem message:
	[at-loader] cannot resolve module  (... and then a css file)
# fix:
	call "yarn build" in the console first, then "yarn start"