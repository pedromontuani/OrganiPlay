export class RecompensaMundo {
    public $key: string;
    constructor(
        public recompensa: string,
        public descricao: string,
        public qtd: number,
        public icon: string,
        public photoUrl: string,
        public nivel: string,
        public afazer: string,
        public moedas: number,
        public gemas: number,
        public dinheiro: string
    ) { }
}