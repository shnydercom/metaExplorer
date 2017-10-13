import { DefaultInterpreterMatcher } from "defaults/DefaultInterpreterMatcher";
import { IInterpreterMatcher } from "ldaccess/iinterpreter-matcher";

class AppInterpreterMatcher extends DefaultInterpreterMatcher{
}
const appIntMatcher: IInterpreterMatcher = new AppInterpreterMatcher();
export default appIntMatcher;
