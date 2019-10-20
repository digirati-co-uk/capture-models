import { createContext } from '../utility/create-context';
import { CaptureModelContext } from '../types/capture-model';

const [useContext, InternalProvider] = createContext<CaptureModelContext>();

export { useContext, InternalProvider };
