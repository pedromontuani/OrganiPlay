export class ItemLojaTema {
    public $key: string;
    constructor (
        public nome: string,
        public descricao: string,
        public tipo: string,
        public qtd: number,
        public nivel: number,
        public moedas: number,
        public gemas: number,
        public ativado: boolean,
        public cores: any
    ) {}
}