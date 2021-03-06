import { BotModule } from '../botModule';
import { commandMap } from './commands';
import { BotModuleMeta, ExecCommand } from '../../types';

class Core extends BotModule<ExecCommand> {
  public static meta: BotModuleMeta = {
    id: 'core',
    title: 'Core',
  };

  public commandMap = commandMap;

  constructor() {
    super(Core.meta);
  }
}

export const CoreModule = new Core();
