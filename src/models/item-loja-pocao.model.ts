export class ItemLojaPocao {
    public $key: string;
    constructor (
        public nome: string,
        public descricao: string,
        public tipo: string,
        public qtd: number,
        public nivel: number,
        public moedas: number,
        public gemas: number,
        public imgURL: string,
        public ativado: boolean,
        public reviver: boolean,
        public hp: number
    ) {}
}