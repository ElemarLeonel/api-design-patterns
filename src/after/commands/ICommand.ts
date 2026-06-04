// Interface comum para todos os comandos
export interface ICommand {
  execute(): Promise<any>;
}
