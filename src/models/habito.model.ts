export class Habito {
    public $key: string;
    constructor(
        public habito: string,
        public tipo: string,
        public descricao: string,
        public nivel: string,
        public dataInicio: any,
        public dataFim: any
    ){}
}