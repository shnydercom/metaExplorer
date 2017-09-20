## architectural considerations
decorators could be used for a variety of purposes:
a) to take a portion of the json-ld, map that portion, or specify a mapping function/json to use
b) specify, which parts of a component are language-sensitive or not
    b 1.) i.e. need language info from json-ld (maybe trigger additional loads/cache hits?)
    b 2.) provide their own language formatting skills, i.e. support for date formatting in different languages 
        (e.g. datepicker: 2017年09月12日 vs. 12. September 2017)
c) to load data from the server and hand it to a component
    c 1.) apollo-react (graphql + redux) do this with the functions mapStateToProps() and mapResultsToProps()
d) in combination with react: which of its parameters should it "lift up", should it do that?


