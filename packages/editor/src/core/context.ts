import { CaptureModelContext } from '@capture-models/types';
import { createContext } from '../utility/create-context';

const [useContext, InternalProvider] = createContext<CaptureModelContext>();

export { useContext, InternalProvider };
