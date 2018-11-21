export class RecompensaMundo {
    public $key: string;
    constructor(
        public recompensa: string,
        public descricao: string,
        public qtd: number,
        public icon: string,
        public photoUrl: string,
        public nivel: number,
        public afazer: string,
        public moedas: number,
        public gemas: number,
        public dinheiro: string,
        public portadores: string
    ) { }
}