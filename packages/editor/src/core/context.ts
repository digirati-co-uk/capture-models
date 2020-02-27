import { CaptureModelContext } from '@capture-models/types';
import { createContext } from '@capture-models/helpers';

const [useContext, InternalProvider] = createContext<CaptureModelContext>();

export { useContext, InternalProvider };
