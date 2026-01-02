import jetPaths from 'jet-paths';

const PATHS = {
  _: '/api',
} as const;

export const JET_PATHS = jetPaths(PATHS);
export default PATHS;
