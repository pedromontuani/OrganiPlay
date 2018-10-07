export class SubmissaoTarefa {
    public $key: string;
    constructor(
        public timestamp: any,
        public photoUrl: string,
        public verificado: boolean
    ) {

    }
}