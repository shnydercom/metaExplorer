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

state of react-components shouldn't be treated as application state, but "view state", if such a thing exists. That means,
the state of the react-component must be completely irrelevant if the react-component is destroyed. All application state 
mutations should be done through actions, that can be triggered in React

react-components only export the result of the connect-function,
anything else is internal

## style considerations/code convenctions/patterns:
a dollar sign at the end is a common RxJS convention to identify variables that reference a stream
# fat arrows:
// mapping
    console.log(smartPhones.map(
        smartPhone=&gt;smartPhone.price
    )); // [649, 576, 489]
//Promise chaining
    aAsync().then(() => bAsync()).then(() => cAsync()).done(() => finish);

#generator-iterator-pattern of es6: 
    function *foo() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
        yield 5;
        return 6;
    }
    for (var v of foo()) {
        console.log( v );
    }
    // 1 2 3 4 5
    console.log( v ); // still `5`, not `6`
//other example
    function *foo(x) {
        var y = 2 * (yield (x + 1));
        var z = yield (y / 3);
        return (x + y + z);
    }
    var it = foo( 5 );
    // note: not sending anything into `next()` here
    console.log( it.next() );       // { value:6, done:false }
    console.log( it.next( 12 ) );   // { value:8, done:false }
    console.log( it.next( 13 ) );   // { value:42, done:true }

# fetch as an epic:
https://stackoverflow.com/questions/38589383/use-fetch-instead-of-ajax-with-redux-observable
const api = {
  fetchUser: id => {
    const request = fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => response.json());
    return Observable.from(request);
  }
};
//You can then consume that in your Epic and apply any operators you want:
const fetchUserEpic = action$ =>
  action$.ofType(FETCH_USER)
    .mergeMap(action =>
      api.fetchUser(action.payload) // This returns our Observable wrapping the Promise
        .map(payload => ({ type: FETCH_USER_FULFILLED, payload }))
    );