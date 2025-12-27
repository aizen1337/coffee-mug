import logger from 'jet-logger';
import { copy, copyFilesRec, exec, remove } from './common/utils';

/******************************************************************************
                                  Run
******************************************************************************/

/**
 * Start
 */
(async () => {
  try {
    // Remove current build
    await remove('./dist/');
    await exec('npm run lint', '../');
    await exec('tsc --project tsconfig.prod.json', '../');
    await exec('tsc-alias --project tsconfig.prod.json', '../');   
    await copyFilesRec('./src', './dist', ['.ts']);
    await copy('./temp/config.js', './dist/config.js');
    await copy('./temp/src', './dist');
    await remove('./temp/');
  } catch (err) {
    logger.err(err);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
})();

