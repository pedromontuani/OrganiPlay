import { SubmissaoTarefa } from "./submissao-tarefa.model";

export class Afazer {
    public $key: string;
    constructor(
        public afazer: string,
        public descricao: string,
        public icon: string,
        public nivel: string,
        public dataFim: any,
        public recompensa: string,
        public finalizado: boolean,
        public comprovacao: boolean,
        public submissoes: SubmissaoTarefa[]
    ){}
}