export class Recompensa {
    public $key: string;
    constructor(
        public recompensa: string,
        public descricao: string,
        public nivel: string,
        public afazer: string,
        public moedas: number,
        public gemas: number,
        public dinheiro: string
    ) { }
}