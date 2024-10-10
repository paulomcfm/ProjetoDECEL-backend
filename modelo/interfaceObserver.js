export default class InterfaceObserver{
    constructor() {
        if (new.target === InterfaceObserver) {
            throw new Error("Não é possível instanciar uma interface.");
        }
    }

    update(){}
}