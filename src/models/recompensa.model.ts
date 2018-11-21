export class Recompensa {
    public $key: string;
    constructor(
        public recompensa: string,
        public descricao: string,
        public icon: string,
        public nivel: number,
        public afazer: string,
        public moedas: number,
        public gemas: number,
        public dinheiro: string
    ) { }
}