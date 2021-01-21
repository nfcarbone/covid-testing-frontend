import * as scrolling from './scrolling';
import * as storage from './storage';
import * as fetching from './fetching';
import * as locations from './locations';
import * as appointments from './appointments';
import * as valid from './valid';
import { useTryCatchFinally } from './useTryCatchFinally';

const tools = {
  ...scrolling,
  ...storage,
  ...fetching,
  ...locations,
  ...appointments,
  ...valid,
  useTryCatchFinally,
};

export default tools;
